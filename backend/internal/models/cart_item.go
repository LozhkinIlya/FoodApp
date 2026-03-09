package models

import (
	"time"

	"gorm.io/gorm"
)

type CartItem struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	UserID    uint           `gorm:"not null;index" json:"user_id"`
	ProductID uint           `gorm:"not null" json:"product_id"`
	Idx       string         `gorm:"not null;index" json:"idx"`
	CreatedAt time.Time      `json:"created_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	Product Product `gorm:"foreignKey:ProductID" json:"product,omitempty"`
}

func (CartItem) TableName() string {
	return "cart_items"
}
