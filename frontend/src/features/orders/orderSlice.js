import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import orderService from "./orderService";

const initialState = {
  orders: [],
  isSuccess: false,
  isError: false,
  isLoading: false,
  message: "",
};

// create order
export const createOrderThunk = createAsyncThunk(
  "orders/create",
  async (orderData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await orderService.createOrder(orderData, token);
    } catch (error) {
      const message =
        (error.message && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// get orders
export const getOrdersThunk = createAsyncThunk(
  "orders/getAll",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await orderService.getOrders(token);
    } catch (error) {
      const message =
        (error.message && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// delete order
export const deleteOrderThunk = createAsyncThunk(
  "orders/delete",
  async (orderId, thunkAPI) => {
    try {
      console.log("inside delete thunk");
      const token = thunkAPI.getState().auth.user.token;
      return await orderService.deleteOrder(orderId, token);
    } catch (error) {
      const message =
        (error.message && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrderThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isLoading = false;
        state.orders.push(action.payload);
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getOrdersThunk.pending, (state) => {
        state.isLoading = true;
        // state.isError = false;
      })
      .addCase(getOrdersThunk.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isLoading = false;
        // state.isError = false;
        state.orders = action.payload;
      })
      .addCase(getOrdersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteOrderThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteOrderThunk.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isLoading = false;
        state.orders = state.orders.filter(
          (order) => order._id !== action.payload.id
        );
      })
      .addCase(deleteOrderThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = orderSlice.actions;
export default orderSlice.reducer;
