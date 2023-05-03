import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import axios from "axios";

const USERS_URL = "http://localhost:5000/users";

const usersAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.updatedAt.localeCompare(a.updatedAt),
});

const initialState = usersAdapter.getInitialState({
  status: "idle",
  error: null,
  count: 0,
});

export const fetchUsersThunk = createAsyncThunk("users/fetch", async () => {
  try {
    const response = await axios.get(USERS_URL);
    const { status, data } = response;
    if (status < 200 || status >= 300) {
      throw new Error(data.message);
    }
    return data.data;
  } catch (error) {
    throw new Error(error.response.data.message);
    return error.message;
  }
});

export const createUserThunk = createAsyncThunk(
  "users/create",
  async (userData) => {
    try {
      const response = await axios.post(USERS_URL, userData);
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

export const updateUserThunk = createAsyncThunk(
  "users/update",
  async (userData) => {
    try {
      const dataSent = {
        ...userData,
        roles: userData.roles,
      };
      
      const response = await axios.patch(
        USERS_URL + "/" + userData.id,
        dataSent
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

export const deleteUserThunk = createAsyncThunk("users/delete", async (id) => {
  try {
    const response = await axios.delete(USERS_URL + "/" + id);
    const { status, data } = response;
    if (status < 200 || status >= 300) {
      throw new Error(data.message);
    }
    return data.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    increaseCount: (state) => {
      state.count += 1;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUsersThunk.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.status = "fulfilled";
        usersAdapter.upsertMany(state, action.payload);
      })
      .addCase(fetchUsersThunk.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.response.data.message;
      })
      .addCase(createUserThunk.pending, (state) => {
        state.status = "pending";
      })
      .addCase(createUserThunk.fulfilled, (state, action) => {
        state.status = "fulfilled";
        // state.users.push(action.payload);
        usersAdapter.addOne(state, action.payload);
      })
      .addCase(createUserThunk.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      })
      .addCase(updateUserThunk.pending, (state) => {
        state.status = "pending";
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.status = "fulfilled";
        // const { _id: id } = action.payload;
        // const users = JSON.parse(
        //   JSON.stringify(
        //     state.users.filter((user) => {
        //       const userId = JSON.stringify(user._id).replace(/"/g, "");
        //       return userId !== id;
        //     })
        //   )
        // );
        // state.users = [...users, action.payload];
        usersAdapter.upsertOne(state, action.payload);
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      })
      .addCase(deleteUserThunk.pending, (state) => {
        state.status = "pending";
      })
      .addCase(deleteUserThunk.fulfilled, (state, action) => {
        state.status = "fulfilled";
        const { _id: id } = action.payload;
        // get list of orders where the deleted order doesnt exist
        // const users = state.users.filter((user) => {
        //   const orderId = JSON.stringify(user._id).replace(/"/g, "");
        //   return orderId !== id;
        // });
        // update the users to the one above
        // state.users = users;
        usersAdapter.removeOne(state, id);
      })
      .addCase(deleteUserThunk.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      });
  },
});

export const { selectAll: selectAllUsers, selectById: selectUserById } =
  usersAdapter.getSelectors((state) => state.users);
// export const selectAllUsers = (state) => state.users.users;
// export const selectUserById = (state, id) =>
//   state.users.users.find((user) => {
//     return user._id === id;
//   });
export const selectUsersStatus = (state) => state.users.status;
export const selectUsersError = (state) => state.users.error;
export const getCount = (state) => state.users.count;

export const { increaseCount } = usersSlice.actions;

export default usersSlice.reducer;
