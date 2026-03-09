package models

type Product struct {
	ID          uint   `gorm:"primaryKey" json:"id"`
	URL         string `gorm:"not null" json:"url"`
	Title       string `gorm:"not null" json:"title"`
	Description string `json:"description"`
	Price       int    `gorm:"not null" json:"price"`
	Weight      string `json:"weight"`
}

func (Product) TableName() string {
	return "products"
}
