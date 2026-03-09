import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { BasketItem } from '../types';
import { api, cartToBasketItems } from '../services/api';

interface BasketSliceState {
  basket: BasketItem[];
  countProducts: number;
  priceBasket: number;
  loading: boolean;
  error: string | null;
}

const initialState: BasketSliceState = {
  basket: [],
  countProducts: 0,
  priceBasket: 0,
  loading: false,
  error: null,
};

const calculateTotalPrice = (items: BasketItem[]): number =>
  items.reduce((sum, current) => sum + current.price, 0);

export const fetchCart = createAsyncThunk(
  'basket/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const cart = await api.fetchCart();
      return cartToBasketItems(cart);
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk<BasketItem, number, { rejectValue: string }>(
  'basket/addToCart',
  async (productId, { rejectWithValue }) => {
    try {
      const result = await api.addToCart(productId);
      return {
        id: result.product.id,
        idx: result.idx,
        url: result.product.url,
        title: result.product.title,
        description: result.product.description,
        price: result.product.price,
        weight: result.product.weight,
      };
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to add to cart');
    }
  }
);

export const removeFromCart = createAsyncThunk<string, string, { rejectValue: string }>(
  'basket/removeFromCart',
  async (idx, { rejectWithValue }) => {
    try {
      await api.removeFromCart(idx);
      return idx;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to remove from cart');
    }
  }
);

const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    clearCart(state) {
      state.basket = [];
      state.countProducts = 0;
      state.priceBasket = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.basket = action.payload;
        state.priceBasket = calculateTotalPrice(action.payload);
        state.countProducts = action.payload.length;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch cart';
      })
      // addToCart
      .addCase(addToCart.fulfilled, (state, action) => {
        state.basket.push(action.payload);
        state.priceBasket = calculateTotalPrice(state.basket);
        state.countProducts = state.basket.length;
      })
      // removeFromCart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.basket = state.basket.filter((item) => item.idx !== action.payload);
        state.priceBasket = calculateTotalPrice(state.basket);
        state.countProducts = state.basket.length;
      });
  },
});

export const { clearCart } = basketSlice.actions;
export default basketSlice.reducer;
