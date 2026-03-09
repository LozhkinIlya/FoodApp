package handlers

import (
	"net/http"

	"foodapp/backend/internal/middleware"
	"foodapp/backend/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type AddToCartRequest struct {
	ProductID uint `json:"product_id" binding:"required"`
}

type CartItemResponse struct {
	ID        uint   `json:"id"`
	ProductID uint   `json:"product_id"`
	Idx       string `json:"idx"`
	Product   models.Product `json:"product"`
}

type CartResponse struct {
	Basket        []CartItemResponse `json:"basket"`
	CountProducts int                `json:"countProducts"`
	PriceBasket   int                `json:"priceBasket"`
}

func GetCart(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, ok := middleware.GetUserID(c)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		var items []models.CartItem
		if err := db.Preload("Product").Where("user_id = ?", userID).Find(&items).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch cart"})
			return
		}

		basket := make([]CartItemResponse, len(items))
		totalPrice := 0
		for i, item := range items {
			basket[i] = CartItemResponse{
				ID:        item.ID,
				ProductID: item.ProductID,
				Idx:       item.Idx,
				Product:   item.Product,
			}
			totalPrice += item.Product.Price
		}

		c.JSON(http.StatusOK, CartResponse{
			Basket:        basket,
			CountProducts: len(basket),
			PriceBasket:   totalPrice,
		})
	}
}

func AddToCart(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, ok := middleware.GetUserID(c)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		var req AddToCartRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
			return
		}

		var product models.Product
		if err := db.First(&product, req.ProductID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
			return
		}

		item := models.CartItem{
			UserID:    userID,
			ProductID: product.ID,
			Idx:       uuid.New().String(),
		}
		if err := db.Create(&item).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add to cart"})
			return
		}

		c.JSON(http.StatusCreated, CartItemResponse{
			ID:        item.ID,
			ProductID: item.ProductID,
			Idx:       item.Idx,
			Product:   product,
		})
	}
}

func RemoveFromCart(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, ok := middleware.GetUserID(c)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		idx := c.Param("idx")
		result := db.Where("user_id = ? AND idx = ?", userID, idx).Delete(&models.CartItem{})
		if result.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove from cart"})
			return
		}
		if result.RowsAffected == 0 {
			c.JSON(http.StatusNotFound, gin.H{"error": "Cart item not found"})
			return
		}

		c.Status(http.StatusNoContent)
	}
}
