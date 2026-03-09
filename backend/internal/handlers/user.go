package handlers

import (
	"net/http"

	"foodapp/backend/internal/middleware"
	"foodapp/backend/internal/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type UserResponse struct {
	ID    uint   `json:"id"`
	Login string `json:"login"`
}

func GetMe(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, ok := middleware.GetUserID(c)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		var user models.User
		if err := db.Select("id", "login").First(&user, userID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}

		c.JSON(http.StatusOK, UserResponse{
			ID:    user.ID,
			Login: user.Login,
		})
	}
}
