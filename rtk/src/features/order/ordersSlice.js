import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import axios from "axios";

const ORDERS_URL = "http://localhost:5000/orders";

const ordersAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.updatedAt.localeCompare(a.updatedAt),
});

const initialState = ordersAdapter.getInitialState({
  status: "idle",
  error: "",
});

export const fetchOrdersThunk = createAsyncThunk("orders/fetch", async () => {
  try {
    const response = await axios.get(ORDERS_URL);
    const { status, data } = response;
    if (status < 200 || status >= 300) {
      throw new Error(data.message);
    }
    return data.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});

export const createOrderThunk = createAsyncThunk(
  "orders/create",
  async (orderData) => {
    try {
      const response = await axios.post(ORDERS_URL, orderData);
      const { status, data } = response;
      if (status < 200 || status >= 300) {
        throw new Error(data.message);
      }
      return data.data;
    } catch (error) {
      throw new Error(error.response.data.message);
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
      const { status, data } = response;
      if (status < 200 || status >= 300) {
        throw new Error(data.message);
      }
      return data.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const deleteOrderThunk = createAsyncThunk(
  "orders/delete",
  async (orderId) => {
    try {
      const response = await axios.delete(`${ORDERS_URL}/${orderId}`);
      const { status, data } = response;
      if (status < 200 || status >= 300) {
        throw new Error(data.message);
      }
      return data.data;
    } catch (error) {
      throw new Error(error.response.data.message);
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
        ordersAdapter.upsertMany(state, action.payload);
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
        ordersAdapter.addOne(state, action.payload);
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
        ordersAdapter.upsertOne(state, action.payload);
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
        const { _id: id } = action.payload;
        ordersAdapter.removeOne(state, id);
      })
      .addCase(deleteOrderThunk.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      });
  },
});

export const { selectAll: selectAllOrders, selectById: selectOrderById } =
  ordersAdapter.getSelectors((state) => state.orders);

export const selectOrdersStatus = (state) => state.orders.status;
export const selectOrdersError = (state) => state.orders.error;
export default ordersSlice.reducer;
