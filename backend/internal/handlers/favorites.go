package handlers

import (
	"net/http"
	"strconv"

	"foodapp/backend/internal/middleware"
	"foodapp/backend/internal/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type AddFavoriteRequest struct {
	ProductID uint `json:"product_id" binding:"required"`
}

func GetFavorites(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, ok := middleware.GetUserID(c)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		var favorites []models.Favorite
		if err := db.Preload("Product").Where("user_id = ?", userID).Find(&favorites).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch favorites"})
			return
		}

		products := make([]models.Product, len(favorites))
		for i, f := range favorites {
			products[i] = f.Product
		}

		c.JSON(http.StatusOK, products)
	}
}

func AddFavorite(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, ok := middleware.GetUserID(c)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		var req AddFavoriteRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
			return
		}

		var product models.Product
		if err := db.First(&product, req.ProductID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
			return
		}

		var existing models.Favorite
		if err := db.Where("user_id = ? AND product_id = ?", userID, req.ProductID).First(&existing).Error; err == nil {
			c.JSON(http.StatusOK, product)
			return
		}

		fav := models.Favorite{
			UserID:    userID,
			ProductID: req.ProductID,
		}
		if err := db.Create(&fav).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add favorite"})
			return
		}

		c.JSON(http.StatusCreated, product)
	}
}

func RemoveFavorite(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, ok := middleware.GetUserID(c)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		productIDStr := c.Param("productId")
		productID, err := strconv.ParseUint(productIDStr, 10, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
			return
		}

		result := db.Where("user_id = ? AND product_id = ?", userID, productID).Delete(&models.Favorite{})
		if result.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove favorite"})
			return
		}
		if result.RowsAffected == 0 {
			c.JSON(http.StatusNotFound, gin.H{"error": "Favorite not found"})
			return
		}

		c.Status(http.StatusNoContent)
	}
}
