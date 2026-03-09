package database

import (
	"foodapp/backend/internal/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func Connect(dbPath string) (*gorm.DB, error) {
	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	if err := db.AutoMigrate(
		&models.User{},
		&models.Product{},
		&models.CartItem{},
		&models.Order{},
		&models.OrderItem{},
		&models.Favorite{},
	); err != nil {
		return nil, err
	}

	return db, nil
}
