import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { BasketItem } from '../types';

interface BasketSliceState {
  basket: BasketItem[];
  countProducts: number;
  priceBasket: number;
}

const initialState: BasketSliceState = {
  basket: [],
  countProducts: 0,
  priceBasket: 0,
};

const calculateTotalPrice = (items: BasketItem[]): number =>
  items.reduce((sum, current) => sum + current.price, 0);

const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<BasketItem>) {
      state.basket.push(action.payload);
      state.priceBasket = calculateTotalPrice(state.basket);
      state.countProducts = state.basket.length;
    },
    deleteFromCart(state, action: PayloadAction<string>) {
      state.basket = state.basket.filter((item) => item.idx !== action.payload);
      state.priceBasket = calculateTotalPrice(state.basket);
      state.countProducts = state.basket.length;
    },
  },
});

export const { addToCart, deleteFromCart } = basketSlice.actions;
export default basketSlice.reducer;
