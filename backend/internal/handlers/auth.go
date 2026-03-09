package handlers

import (
	"net/http"
	"time"

	"foodapp/backend/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type RegisterRequest struct {
	Login    string `json:"login" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginRequest struct {
	Login    string `json:"login" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type AuthResponse struct {
	Token string `json:"token"`
}

func Register(db *gorm.DB, jwtSecret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req RegisterRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
			return
		}

		if len(req.Login) < 4 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Login must be at least 4 characters"})
			return
		}
		if len(req.Password) < 3 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Password must be at least 3 characters"})
			return
		}

		hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
			return
		}

		user := models.User{
			Login:        req.Login,
			PasswordHash: string(hash),
		}
		if err := db.Create(&user).Error; err != nil {
			c.JSON(http.StatusConflict, gin.H{"error": "Login already exists"})
			return
		}

		token, err := createToken(user.ID, jwtSecret)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create token"})
			return
		}

		c.JSON(http.StatusCreated, AuthResponse{Token: token})
	}
}

func Login(db *gorm.DB, jwtSecret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req LoginRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
			return
		}

		var user models.User
		if err := db.Where("login = ?", req.Login).First(&user).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "user_not_found"})
			return
		}

		if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid_password"})
			return
		}

		token, err := createToken(user.ID, jwtSecret)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create token"})
			return
		}

		c.JSON(http.StatusOK, AuthResponse{Token: token})
	}
}

func createToken(userID uint, secret string) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}
