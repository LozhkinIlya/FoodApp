package main

import (
	"log"

	"foodapp/backend/internal/config"
	"foodapp/backend/internal/database"
	"foodapp/backend/internal/handlers"
	"foodapp/backend/internal/middleware"

	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.Load()

	db, err := database.Connect(cfg.DBPath)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	if err := database.SeedProducts(db); err != nil {
		log.Fatalf("Failed to seed products: %v", err)
	}

	r := gin.Default()

	r.Use(middleware.CORS())

	api := r.Group("/api")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/register", handlers.Register(db, cfg.JWTSecret))
			auth.POST("/login", handlers.Login(db, cfg.JWTSecret))
		}

		api.GET("/products", handlers.GetProducts(db))
		api.GET("/products/:id", handlers.GetProduct(db))

		protected := api.Group("")
		protected.Use(middleware.Auth(cfg.JWTSecret))
		{
			protected.GET("/cart", handlers.GetCart(db))
			protected.POST("/cart", handlers.AddToCart(db))
			protected.DELETE("/cart/:idx", handlers.RemoveFromCart(db))
			protected.POST("/orders", handlers.CreateOrder(db))
			protected.GET("/orders", handlers.GetOrders(db))
			protected.PATCH("/orders/:id/cancel", handlers.CancelOrder(db))
			protected.GET("/user/me", handlers.GetMe(db))
			protected.GET("/favorites", handlers.GetFavorites(db))
			protected.POST("/favorites", handlers.AddFavorite(db))
			protected.DELETE("/favorites/:productId", handlers.RemoveFavorite(db))
		}
	}

	addr := ":" + cfg.Port
	log.Printf("Server starting on %s", addr)
	if err := r.Run(addr); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
