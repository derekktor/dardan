import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit";
import axios from "axios";
import { apiSlice } from "../api/apiSlice";

// const ORDERS_URL = "http://localhost:5000/orders";

const ordersAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.updatedAt.localeCompare(a.updatedAt),
});

const initialState = ordersAdapter.getInitialState();
// const initialState = ordersAdapter.getInitialState({
//   status: "idle",
//   error: "",
// });

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => "/orders",
      transformResponse: (responseData) => {
        return ordersAdapter.setAll(initialState, responseData.data);
      },
      providesTags: (result, error, arg) => [
        { type: "Order", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Order", id })),
      ],
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
        // body: {
        //   ...initialOrder,
        //   userId: initialOrder.userId
        // }
      }),
      invalidatesTags: [{ type: "Order", id: "LIST" }],
    }),
    updateOrder: builder.mutation({
      query: (initialOrder) => ({
        url: `/orders/${initialOrder.id}`,
        method: "PATCH",
        body: initialOrder,
        // body: {
        //   ...initialOrder,
        //   updatedAt: new Date().toISOString(),
        // }
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Order", id: arg.id }],
    }),
    deleteOrder: builder.mutation({
      query: (orderId) => ({
        url: `/orders/${orderId}`,
        method: "DELETE",
        body: orderId,
        // body: {
        //   ...initialOrder,
        //   updatedAt: new Date().toISOString(),
        // }
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
} = extendedApiSlice;

// returns the response from the api, array of orders
export const selectOrdersResult = extendedApiSlice.endpoints.getOrders.select();

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

// export const selectOrdersStatus = (state) => state.orders.status;
// export const selectOrdersError = (state) => state.orders.error;
// export default ordersSlice.reducer;

// export const fetchOrdersThunk = createAsyncThunk("orders/fetch", async () => {
//   try {
//     const response = await axios.get(ORDERS_URL);
//     const { status, data } = response;
//     if (status < 200 || status >= 300) {
//       throw new Error(data.message);
//     }
//     return data.data;
//   } catch (error) {
//     throw new Error(error.response.data.message);
//   }
// });

// export const createOrderThunk = createAsyncThunk(
//   "orders/create",
//   async (orderData) => {
//     try {
//       const response = await axios.post(ORDERS_URL, orderData);
//       const { status, data } = response;
//       if (status < 200 || status >= 300) {
//         throw new Error(data.message);
//       }
//       return data.data;
//     } catch (error) {
//       throw new Error(error.response.data.message);
//     }
//   }
// );

// export const updateOrderThunk = createAsyncThunk(
//   "orders/update",
//   async (orderData) => {
//     try {
//       const response = await axios.patch(
//         `${ORDERS_URL}/${orderData.id}`,
//         orderData
//       );
//       const { status, data } = response;
//       if (status < 200 || status >= 300) {
//         throw new Error(data.message);
//       }
//       return data.data;
//     } catch (error) {
//       throw new Error(error.response.data.message);
//     }
//   }
// );

// export const deleteOrderThunk = createAsyncThunk(
//   "orders/delete",
//   async (orderId) => {
//     try {
//       const response = await axios.delete(`${ORDERS_URL}/${orderId}`);
//       const { status, data } = response;
//       if (status < 200 || status >= 300) {
//         throw new Error(data.message);
//       }
//       return data.data;
//     } catch (error) {
//       throw new Error(error.response.data.message);
//     }
//   }
// );

// const ordersSlice = createSlice({
//   name: "orders",
//   initialState,
//   reducers: {},
//   extraReducers(builder) {
//     builder
//       .addCase(fetchOrdersThunk.pending, (state) => {
//         state.status = "pending";
//       })
//       .addCase(fetchOrdersThunk.fulfilled, (state, action) => {
//         state.status = "fulfilled";
//         ordersAdapter.upsertMany(state, action.payload);
//       })
//       .addCase(fetchOrdersThunk.rejected, (state, action) => {
//         state.status = "rejected";
//         state.error = action.error.message;
//       })
//       .addCase(createOrderThunk.pending, (state) => {
//         state.status = "pending";
//       })
//       .addCase(createOrderThunk.fulfilled, (state, action) => {
//         state.status = "fulfilled";
//         ordersAdapter.addOne(state, action.payload);
//       })
//       .addCase(createOrderThunk.rejected, (state, action) => {
//         state.status = "rejected";
//         state.error = action.error.message;
//       })
//       .addCase(updateOrderThunk.pending, (state) => {
//         state.status = "pending";
//       })
//       .addCase(updateOrderThunk.fulfilled, (state, action) => {
//         state.status = "fulfilled";
//         ordersAdapter.upsertOne(state, action.payload);
//       })
//       .addCase(updateOrderThunk.rejected, (state, action) => {
//         state.status = "rejected";
//         state.error = action.error.message;
//       })
//       .addCase(deleteOrderThunk.pending, (state) => {
//         state.status = "pending";
//       })
//       .addCase(deleteOrderThunk.fulfilled, (state, action) => {
//         state.status = "fulfilled";
//         const { _id: id } = action.payload;
//         ordersAdapter.removeOne(state, id);
//       })
//       .addCase(deleteOrderThunk.rejected, (state, action) => {
//         state.status = "rejected";
//         state.error = action.error.message;
//       });
//   },
// });
