import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const USERS_URL = "http://localhost:5000/users";

const initialState = {
  users: [],
  status: "idle",
  error: "",
};

export const fetchUsersThunk = createAsyncThunk("users/fetch", async () => {
  try {
    const response = await axios.get(USERS_URL);
      return response.data.users;
  } catch (error) {
    throw new Error(error.message);
    return error.message;
  }
});

export const createUserThunk = createAsyncThunk(
  "users/create",
  async (userData) => {
    try {
      const response = await axios.post(USERS_URL, userData);
      console.log(response)
      if (response.status === 200) {
          return response.data;
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
        throw new Error(error.message)
    }
  }
);

export const updateUserThunk = createAsyncThunk(
  "users/update",
  async (userData) => {
    try {
      const response = await axios.patch(
        USERS_URL + "/" + userData.id,
        userData
      );
      return response.data;
    } catch (error) {
      return error.message;
    }
  }
);

export const deleteUserThunk = createAsyncThunk("users/delete", async (id) => {
  try {
    console.log(id);
    const response = await axios.delete(USERS_URL + "/" + id);
    return response.data;
  } catch (error) {
    return error.message;
  }
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchUsersThunk.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.users = action.payload;
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
        state.users.push(action.payload.user);
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
        const users = JSON.parse(
          JSON.stringify(
            state.users.filter((user) => {
              const userId = JSON.stringify(user._id).replace(/"/g, "");
              return userId !== action.payload.updatedUser._id;
            })
          )
        );
        state.users = [...users, action.payload.updatedUser];
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
        const { id } = action.payload;
        console.log(action.payload)
        // get list of orders where the deleted order doesnt exist
        const users = state.users.filter((user) => {
          const orderId = JSON.stringify(user._id).replace(/"/g, "");
          return orderId !== id;
        });
        // update the users to the one above
        state.users = users;
        console.log(users);
        console.log(state.users);
        console.log(users);
      })
      .addCase(deleteUserThunk.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      });
  },
});

export const selectAllUsers = (state) => state.users.users;
export const selectUserById = (state, id) =>
  state.users.users.find((user) => {
    return user._id === id;
  });
export const selectUsersStatus = (state) => state.users.status;
export const selectUsersError = (state) => state.users.error;

export default usersSlice.reducer;
