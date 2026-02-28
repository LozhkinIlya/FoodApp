import type { RootState } from './index';

export const selectBasket = (state: RootState) => state.basket.basket;
export const selectCountProducts = (state: RootState) => state.basket.countProducts;
export const selectPriceBasket = (state: RootState) => state.basket.priceBasket;
