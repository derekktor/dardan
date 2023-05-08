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
    getOrdersByUserId: builder.query({
      query: (id) => `/orders/?userId=${id}`,
      transformResponse: (responseData) => {
        console.log("get orders by id called");
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
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrdersByUserIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
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
