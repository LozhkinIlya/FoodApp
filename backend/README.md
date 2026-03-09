# FoodApp Backend

Go backend with SQLite for the FoodApp.

## Requirements

- Go 1.21+

## Run

```bash
cd backend
go run ./cmd/server
```

Server runs on `http://localhost:8080` by default.

## Environment

| Variable   | Default        | Description        |
|-----------|----------------|--------------------|
| PORT      | 8080           | Server port        |
| DB_PATH   | foodapp.db     | SQLite database    |
| JWT_SECRET| (dev default)  | JWT signing secret |

## API

- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login (returns JWT)
- `GET /api/products` - List products
- `GET /api/products/:id` - Get product
- `GET /api/cart` - Get cart (JWT required)
- `POST /api/cart` - Add to cart (JWT required)
- `DELETE /api/cart/:idx` - Remove from cart (JWT required)
- `POST /api/orders` - Create order (JWT required)
- `GET /api/orders` - List orders (JWT required)
