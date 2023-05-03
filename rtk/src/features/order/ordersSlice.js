import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const ORDERS_URL = "http://localhost:5000/orders";

const initialState = {
  orders: [],
  status: "idle",
  error: "",
};

export const fetchOrdersThunk = createAsyncThunk("orders/fetch", async () => {
  try {
    const response = await axios.get(ORDERS_URL);
    return response.data.orders;
  } catch (error) {
    return error.message;
  }
});

export const createOrderThunk = createAsyncThunk(
  "orders/create",
  async (orderData) => {
    try {
      const response = await axios.post(ORDERS_URL, orderData);
      return response.data;
    } catch (error) {
      return error.message;
    }
  }
);

export const updateOrderThunk = createAsyncThunk(
  "orders/update",
  async (orderData) => {
    try {
      const response = await axios.patch(
        `${ORDERS_URL}/${orderData.id}`,
        orderData
      );
      return response.data.data;
    } catch (error) {
      return error.message;
    }
  }
);

export const deleteOrderThunk = createAsyncThunk(
  "orders/delete",
  async (orderId) => {
    try {
      const response = await axios.delete(`${ORDERS_URL}/${orderId}`);
      return response.data;
    } catch (error) {
      return error.message;
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchOrdersThunk.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchOrdersThunk.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.orders = action.payload;
      })
      .addCase(fetchOrdersThunk.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      })
      .addCase(createOrderThunk.pending, (state) => {
        state.status = "pending";
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.orders.push(action.payload.newOrder);
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      })
      .addCase(updateOrderThunk.pending, (state) => {
        state.status = "pending";
      })
      .addCase(updateOrderThunk.fulfilled, (state, action) => {
        state.status = "fulfilled";
        // const order = state.orders.filter(order => order._id !== action.payload._id)
        const { _id } = action.payload;
        // grab orders where the edited order doesnt exist and then add the returning updatedOrder to the previously updated orders
        const orders = state.orders.filter((order) => {
          const orderId = JSON.stringify(order._id).replace(/"/g, "");
          return orderId !== _id;
        });
        state.orders = [...orders, action.payload];
      })
      .addCase(updateOrderThunk.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      })
      .addCase(deleteOrderThunk.pending, (state) => {
        state.status = "pending";
      })
      .addCase(deleteOrderThunk.fulfilled, (state, action) => {
        state.status = "fulfilled";
        const { id } = action.payload;
        // get list of orders where the deleted order doesnt exist
        const orders = state.orders.filter((order) => {
          const orderId = JSON.stringify(order._id).replace(/"/g, "");
          return orderId !== id;
        });
        // update the orders to the one above
        state.orders = orders;
      })
      .addCase(deleteOrderThunk.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      });
  },
});

export const selectAllOrders = (state) => state.orders.orders;
export const selectOrderById = (state, orderId) => {
  return state.orders.orders.find((order) => {
    return order._id === orderId;
  });
};
export const selectOrdersStatus = (state) => state.orders.status;
export const selectOrdersError = (state) => state.orders.error;
export default ordersSlice.reducer;
