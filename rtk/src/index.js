import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { store } from "./app/store";
import { Provider } from "react-redux";
import { fetchUsersThunk } from "./features/user/usersSlice";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { fetchOrdersThunk } from "./features/order/ordersSlice";

store.dispatch(fetchUsersThunk());
store.dispatch(fetchOrdersThunk());

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
