package handlers

import (
	"net/http"
	"strconv"
	"time"

	"foodapp/backend/internal/middleware"
	"foodapp/backend/internal/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type OrderResponse struct {
	ID         uint   `json:"id"`
	TotalPrice int    `json:"total_price"`
	Status     string `json:"status"`
	CreatedAt  time.Time `json:"created_at"`
	Items      []OrderItemResponse `json:"items"`
}

type OrderItemResponse struct {
	ProductID uint   `json:"product_id"`
	Price     int    `json:"price"`
	Quantity  int    `json:"quantity"`
	Product   models.Product `json:"product"`
}

func CreateOrder(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, ok := middleware.GetUserID(c)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		var cartItems []models.CartItem
		if err := db.Preload("Product").Where("user_id = ?", userID).Find(&cartItems).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch cart"})
			return
		}

		if len(cartItems) == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Cart is empty"})
			return
		}

		totalPrice := 0
		for _, item := range cartItems {
			totalPrice += item.Product.Price
		}

		var order models.Order
		err := db.Transaction(func(tx *gorm.DB) error {
			order = models.Order{
				UserID:     userID,
				TotalPrice: totalPrice,
				Status:     "pending",
			}
			if err := tx.Create(&order).Error; err != nil {
				return err
			}

			for _, item := range cartItems {
				orderItem := models.OrderItem{
					OrderID:   order.ID,
					ProductID: item.ProductID,
					Price:     item.Product.Price,
					Quantity:  1,
				}
				if err := tx.Create(&orderItem).Error; err != nil {
					return err
				}
			}

			return tx.Where("user_id = ?", userID).Delete(&models.CartItem{}).Error
		})

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order"})
			return
		}

		if err := db.Preload("Items.Product").First(&order, order.ID).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch order"})
			return
		}

		items := make([]OrderItemResponse, len(order.Items))
		for i, oi := range order.Items {
			items[i] = OrderItemResponse{
				ProductID: oi.ProductID,
				Price:     oi.Price,
				Quantity:  oi.Quantity,
				Product:   oi.Product,
			}
		}

		c.JSON(http.StatusCreated, OrderResponse{
			ID:         order.ID,
			TotalPrice: order.TotalPrice,
			Status:     order.Status,
			CreatedAt:  order.CreatedAt,
			Items:      items,
		})
	}
}

func GetOrders(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, ok := middleware.GetUserID(c)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		var orders []models.Order
		if err := db.Preload("Items.Product").Where("user_id = ?", userID).Order("id DESC").Find(&orders).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch orders"})
			return
		}

		response := make([]OrderResponse, len(orders))
		for i, order := range orders {
			items := make([]OrderItemResponse, len(order.Items))
			for j, oi := range order.Items {
				items[j] = OrderItemResponse{
					ProductID: oi.ProductID,
					Price:     oi.Price,
					Quantity:  oi.Quantity,
					Product:   oi.Product,
				}
			}
			response[i] = OrderResponse{
				ID:         order.ID,
				TotalPrice: order.TotalPrice,
				Status:     order.Status,
				CreatedAt:  order.CreatedAt,
				Items:      items,
			}
		}

		c.JSON(http.StatusOK, response)
	}
}

func CancelOrder(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, ok := middleware.GetUserID(c)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		orderIDStr := c.Param("id")
		orderID, err := strconv.ParseUint(orderIDStr, 10, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid order ID"})
			return
		}

		var order models.Order
		if err := db.First(&order, orderID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
			return
		}

		if order.UserID != userID {
			c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
			return
		}

		if order.Status != "pending" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Only pending orders can be cancelled"})
			return
		}

		if err := db.Model(&order).Update("status", "cancelled").Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to cancel order"})
			return
		}

		if err := db.Preload("Items.Product").First(&order, order.ID).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch order"})
			return
		}

		items := make([]OrderItemResponse, len(order.Items))
		for i, oi := range order.Items {
			items[i] = OrderItemResponse{
				ProductID: oi.ProductID,
				Price:     oi.Price,
				Quantity:  oi.Quantity,
				Product:   oi.Product,
			}
		}

		c.JSON(http.StatusOK, OrderResponse{
			ID:         order.ID,
			TotalPrice: order.TotalPrice,
			Status:     "cancelled",
			CreatedAt:  order.CreatedAt,
			Items:      items,
		})
	}
}
