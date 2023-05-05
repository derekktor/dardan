import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/" }),
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    // getOrders: builder.query({
    // //   query: () => ({ url: "orders" }),
    //   query: () => "orders"
    // }),
    // createOrder: builder.mutation({
    //   query: (orderData) => ({
    //     url: "orders",
    //     method: "POST",
    //     body: orderData,
    //   }),
    // }),
    // updateOrder: builder.mutation({
    //   query: (orderData) => ({
    //     url: `orders/${orderData.id}`,
    //     method: "PATCH",
    //     body: orderData,
    //   }),
    // }),
    // deleteOrder: builder.mutation({
    //   query: (orderId) => ({
    //     url: `orders/${orderId}`,
    //     method: "DELETE",
    //     body: orderId,
    //   }),
    // }),
  }),
});

export const {
  // useGetOrdersQuery,
  // useCreateOrderMutation,
  // useUpdateOrderMutation,
  // useDeleteOrderMutation
} = apiSlice;
