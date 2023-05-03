import {configureStore} from "@reduxjs/toolkit";
import usersReducer from "../features/user/usersSlice";
import ordersReducer from "../features/order/ordersSlice";

export const store = configureStore({
    reducer: {
        users: usersReducer,
        orders: ordersReducer
    }
})