package models

import (
	"time"

	"gorm.io/gorm"
)

type Order struct {
	ID         uint           `gorm:"primaryKey" json:"id"`
	UserID     uint           `gorm:"not null;index" json:"user_id"`
	TotalPrice int            `gorm:"not null" json:"total_price"`
	Status     string         `gorm:"default:'pending'" json:"status"`
	CreatedAt  time.Time      `json:"created_at"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"-"`

	Items []OrderItem `gorm:"foreignKey:OrderID" json:"items,omitempty"`
}

func (Order) TableName() string {
	return "orders"
}

type OrderItem struct {
	ID        uint   `gorm:"primaryKey" json:"id"`
	OrderID   uint   `gorm:"not null;index" json:"order_id"`
	ProductID uint   `gorm:"not null" json:"product_id"`
	Price     int    `gorm:"not null" json:"price"`
	Quantity  int    `gorm:"not null;default:1" json:"quantity"`

	Product Product `gorm:"foreignKey:ProductID" json:"product,omitempty"`
}

func (OrderItem) TableName() string {
	return "order_items"
}
