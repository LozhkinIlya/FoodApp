package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID           uint           `gorm:"primaryKey" json:"id"`
	Login        string         `gorm:"uniqueIndex;not null" json:"login"`
	PasswordHash string         `gorm:"column:password_hash;not null" json:"-"`
	CreatedAt    time.Time      `json:"created_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
}

func (User) TableName() string {
	return "users"
}
