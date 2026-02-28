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

export interface BasketState {
  basket: BasketItem[];
  countProducts: number;
  priceBasket: number;
}
