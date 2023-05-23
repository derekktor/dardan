import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom';
import {store} from "../../app/store";
import { extendedOrdersApiSlice } from "../orders/ordersApiSlice"
import { extendedUsersApiSlice } from '../users/usersApiSlice';

const Prefetch = () => {
    useEffect(() => {
        console.log("subscribing");
        const orders = store.dispatch(extendedOrdersApiSlice.endpoints.getOrders.initiate());
        const users = store.dispatch(extendedUsersApiSlice.endpoints.getUsers.initiate());

        // store.dispatch(extendedOrdersApiSlice.util.prefetch("getOrders", "ordersList", { force: true }))
        // store.dispatch(extendedUsersApiSlice.util.prefetch("getUsers", "usersList", { force: true }))

        return () => {
            console.log("unsubscribing");
            orders.unsubscribe();
            users.unsubscribe();
        }
    }, [])
  return (
    <Outlet />
  )
}

export default Prefetch