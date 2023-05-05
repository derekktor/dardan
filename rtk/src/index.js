import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ApiProvider } from "@reduxjs/toolkit/dist/query/react";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { store } from "./app/store";
import { apiSlice } from "./app/api/apiSlice";
import { extendedOrdersApiSlice } from "./features/order/ordersSlice";
import { extendedUsersApiSlice } from "./features/user/usersSlice";

store.dispatch(extendedOrdersApiSlice.endpoints.getOrders.initiate());
store.dispatch(extendedUsersApiSlice.endpoints.getUsers.initiate());

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ApiProvider api={apiSlice}>
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </BrowserRouter>
      </ApiProvider>
    </Provider>
  </React.StrictMode>
);
