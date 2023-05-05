import {configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";
import ordersReducer from "../features/order/ordersSlice";
import { apiSlice } from "../features/api/apiSlice";

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware),
})