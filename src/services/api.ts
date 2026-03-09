const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const TOKEN_KEY = 'foodapp_token';

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${path}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  const token = getToken();
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export interface Product {
  id: number;
  url: string;
  title: string;
  description: string;
  price: number;
  weight: string;
}

export interface BasketItem extends Product {
  idx: string;
}

export interface CartResponse {
  basket: Array<{
    id: number;
    product_id: number;
    idx: string;
    product: Product;
  }>;
  countProducts: number;
  priceBasket: number;
}

export interface UserResponse {
  id: number;
  login: string;
}

export interface OrderResponse {
  id: number;
  total_price: number;
  status: string;
  created_at: string;
  items: Array<{
    product_id: number;
    price: number;
    quantity: number;
    product: Product;
  }>;
}

export const api = {
  async fetchProducts(): Promise<Product[]> {
    return request<Product[]>('/api/products');
  },

  async fetchProduct(id: number): Promise<Product> {
    return request<Product>(`/api/products/${id}`);
  },

  async register(login: string, password: string): Promise<{ token: string }> {
    return request<{ token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ login, password }),
    });
  },

  async login(login: string, password: string): Promise<{ token: string }> {
    return request<{ token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ login, password }),
    });
  },

  async fetchCart(): Promise<CartResponse> {
    return request<CartResponse>('/api/cart');
  },

  async addToCart(productId: number): Promise<{ id: number; product_id: number; idx: string; product: Product }> {
    return request(`/api/cart`, {
      method: 'POST',
      body: JSON.stringify({ product_id: productId }),
    });
  },

  async removeFromCart(idx: string): Promise<void> {
    return request(`/api/cart/${idx}`, { method: 'DELETE' });
  },

  async createOrder(): Promise<OrderResponse> {
    return request<OrderResponse>('/api/orders', { method: 'POST' });
  },

  async fetchOrders(): Promise<OrderResponse[]> {
    return request<OrderResponse[]>('/api/orders');
  },

  async cancelOrder(orderId: number): Promise<OrderResponse> {
    return request<OrderResponse>(`/api/orders/${orderId}/cancel`, { method: 'PATCH' });
  },

  async fetchUser(): Promise<UserResponse> {
    return request<UserResponse>('/api/user/me');
  },

  async fetchFavorites(): Promise<Product[]> {
    return request<Product[]>('/api/favorites');
  },

  async addFavorite(productId: number): Promise<Product> {
    return request<Product>('/api/favorites', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId }),
    });
  },

  async removeFavorite(productId: number): Promise<void> {
    return request(`/api/favorites/${productId}`, { method: 'DELETE' });
  },
};

export function cartToBasketItems(cart: CartResponse): BasketItem[] {
  return cart.basket.map((item) => ({
    id: item.product.id,
    idx: item.idx,
    url: item.product.url,
    title: item.product.title,
    description: item.product.description,
    price: item.product.price,
    weight: item.product.weight,
  }));
}
