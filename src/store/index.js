import { configureStore } from '@reduxjs/toolkit';
import basketReducer from '../reducers/basket-reducer';

export default configureStore({
    reducer: {
        basket: basketReducer,
    }
});