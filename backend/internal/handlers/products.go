package handlers

import (
	"net/http"
	"strconv"

	"foodapp/backend/internal/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetProducts(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var products []models.Product
		if err := db.Find(&products).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch products"})
			return
		}
		c.JSON(http.StatusOK, products)
	}
}

func GetProduct(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		idStr := c.Param("id")
		id, err := strconv.ParseUint(idStr, 10, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
			return
		}

		var product models.Product
		if err := db.First(&product, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
			return
		}
		c.JSON(http.StatusOK, product)
	}
}
