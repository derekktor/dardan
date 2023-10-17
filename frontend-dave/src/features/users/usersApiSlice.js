import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const usersAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.updatedAt.localeCompare(a.updatedAt),
});

const initialState = usersAdapter.getInitialState();

export const extendedUsersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    getUsers: builder.query({
      query: () => ({
        url: "/users",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      keepUnusedDataFor: 5, // 5 seconds
      transformResponse: (responseData) => {
        // const usersRenamed = responseData.data.map(user => {
        //   user.id = user.id ? user.id : user._id;
        //   return user;
        // })
        // return usersAdapter.setAll(initialState, usersRenamed);
        return usersAdapter.setAll(initialState, responseData.data);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "User", id: "LIST" },
            ...result.ids.map((id) => ({ type: "User", id })),
          ];
        } else return [{ type: "User", id: "LIST" }];
      },
    }),

    createUser: builder.mutation({
      query: (initialUserData) => ({
        url: "/users",
        method: "POST",
        body: initialUserData,
        // body: {
        //   ...initialUserData,
        //   userId: initialUserData.userId
        // }
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    updateUser: builder.mutation({
      query: (initialUserData) => ({
        url: `/users/${initialUserData.id}`,
        method: "PATCH",
        body: initialUserData,
        // body: {
        //   ...initialUserData,
        //   updatedAt: new Date().toISOString(),
        // }
      }),
      transformResponse: (responseData) => {
        // console.log(responseData);
        return responseData
      },
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
    }),

    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
        body: userId,
        // body: {
        //   ...initialUserData,
        //   updatedAt: new Date().toISOString(),
        // }
      }),
      invalidatesTags: (result, error, arg) => [
        // {type: "User", id: arg.id}
        { type: "User", id: arg },
      ],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = extendedUsersApiSlice;

export const selectUsersResult =
  extendedUsersApiSlice.endpoints.getUsers.select();


const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data
);

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
} = usersAdapter.getSelectors(
  (state) => selectUsersData(state) ?? initialState
);
