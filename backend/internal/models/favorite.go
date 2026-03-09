package models

import (
	"time"
)

type Favorite struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `gorm:"not null;uniqueIndex:idx_user_product" json:"user_id"`
	ProductID uint      `gorm:"not null;uniqueIndex:idx_user_product" json:"product_id"`
	CreatedAt time.Time `json:"created_at"`

	Product Product `gorm:"foreignKey:ProductID" json:"product,omitempty"`
}

func (Favorite) TableName() string {
	return "favorites"
}
