import OrdersList from "./features/order/OrdersList";
import AddOrderForm from "./features/order/AddOrderForm";
import { Routes, Route } from "react-router-dom";
import "./index.css";
import Layout from "./components/Layout";
import SingleOrder from "./features/order/SingleOrder";
import EditOrderForm from "./features/order/EditOrderForm";
import UsersList from "./features/user/UsersList";
import AddUserForm from "./features/user/AddUserForm";
import SingleUser from "./features/user/SingleUser";
import EditUserForm from "./features/user/EditUserForm";

function App() {
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="users">
            <Route index element={<UsersList />} />
            <Route path="add" element={<AddUserForm />} />
            <Route path="edit/:id" element={<EditUserForm />} />
            <Route path=":id" element={<SingleUser />} />
          </Route>
          <Route path="orders">
            <Route index element={<OrdersList />} />
            <Route path="add" element={<AddOrderForm />} />
            <Route path="edit/:orderId" element={<EditOrderForm />} />
            <Route path=":orderId" element={<SingleOrder />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
