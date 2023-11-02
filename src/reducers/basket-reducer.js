import { createSlice } from "@reduxjs/toolkit";

const basketSlice = createSlice({
    name: 'basket',
    initialState: {
        basket: [],
        countProducts: 0,
        priceBasket: 0
    },

    reducers: {
        addToCart(state, action) {
            state.basket.push(action.payload)
            state.priceBasket = state.basket.reduce((sum, current) => {
                return sum = sum + current.price
            }, 0)
            state.countProducts = state.basket.length
        },

        deleteFromCart(state, action) {
            state.basket = state.basket.filter((item) => {
                return item.idx !== action.payload
            })
            state.priceBasket = state.basket.reduce((sum, current) => {
                return sum = sum + current.price
            }, 0)
            state.countProducts = state.basket.length
        }
    }
})

export const { addToCart, deleteFromCart } = basketSlice.actions

export default basketSlice.reducer