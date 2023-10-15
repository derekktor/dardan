import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const ordersAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.updatedAt.localeCompare(a.updatedAt),
});

const initialState = ordersAdapter.getInitialState();

export const extendedOrdersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => ({
        url: "/orders",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        return ordersAdapter.setAll(initialState, responseData.data);
      },
      keepUnusedDataFor: 5, // 5 seconds
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Order", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Order", id })),
          ];
        } else return [{ type: "Order", id: "LIST" }];
      },
    }),
    getOrdersByDate: builder.query({
      query: (date) => {
        return `/orders/export?year=${date.year}&month=${date.month}`;
      }
    }),
    getOrdersByUserId: builder.query({
      query: (id) => `/orders/?userId=${id}`,
      transformResponse: (responseData) => {
        return ordersAdapter.setAll(initialState, responseData);
      },
      providesTags: (result, error, arg) => {
        return [...result.ids.map((id) => ({ type: "Order", id }))];
      },
    }),
    createOrder: builder.mutation({
      query: (initialOrder) => ({
        url: "/orders",
        method: "POST",
        body: initialOrder,
      }),
      transformResponse: (responseData) => {
        return responseData
      },
      invalidatesTags: [{ type: "Order", id: "LIST" }],
    }),
    updateOrder: builder.mutation({
      query: (initialOrder) => ({
        url: `/orders/${initialOrder.id}`,
        method: "PATCH",
        body: initialOrder,
      }),
      transformResponse: (responseData) => {
        return responseData;
      },
      invalidatesTags: (result, error, arg) => [{ type: "Order", id: arg.id }],
    }),
    deleteOrder: builder.mutation({
      query: (orderId) => ({
        url: `/orders/${orderId}`,
        method: "DELETE",
        body: orderId,
      }),
      invalidatesTags: (result, error, arg) => [
        // {type: "Order", id: arg.id}
        { type: "Order", id: arg },
      ],
    }),
    deleteTests: builder.mutation({
      query: () => ({
        url: `/orders/tests`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
        // {type: "Order", id: arg.id}
        { type: "Order", id: arg },
      ],
      transformResponse: (responseData) => {
        return responseData;
      },
      // invalidatesTags: (result, error, arg) => [
      //   // {type: "Order", id: arg.id}
      //   { type: "Order", id: arg },
      // ],
    }),
    deleteAll: builder.mutation({
      query: () => ({
        url: `/orders/all`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
        // {type: "Order", id: arg.id}
        { type: "Order", id: arg },
      ],
      transformResponse: (responseData) => {
        return responseData;
      },
      // invalidatesTags: (result, error, arg) => [
      //   // {type: "Order", id: arg.id}
      //   { type: "Order", id: arg },
      // ],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrdersByDateQuery,
  useGetOrdersByUserIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useDeleteTestsMutation,
  useDeleteAllMutation
} = extendedOrdersApiSlice;

// returns the response from the api, array of orders
export const selectOrdersResult =
  extendedOrdersApiSlice.endpoints.getOrders.select();

const selectOrdersData = createSelector(
  selectOrdersResult,
  (ordersResult) => ordersResult.data
);

export const {
  selectAll: selectAllOrders,
  selectById: selectOrderById,
  selectIds: selectOrderIds,
} = ordersAdapter.getSelectors(
  (state) => selectOrdersData(state) ?? initialState
);
