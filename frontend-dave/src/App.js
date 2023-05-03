import {Routes, Route} from "react-router-dom"
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/Login";
import DashLayout from "./components/DashLayout";
import Welcome from "./features/auth/Welcome";
import OrdersList from "./features/orders/OrdersList";
import UsersList from "./features/users/UsersList";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />}/>
        <Route path="login" element={<Login />}/>
        <Route path="dash" element={<DashLayout />}>
          <Route index element={<Welcome/>}/>
          <Route path="orders">
            <Route index element={<OrdersList />}/>
          </Route>
          <Route path="users">
            <Route index element={<UsersList />}/>
          </Route>
        </Route>
      </Route>
    </Routes>
  )
};

export default App;
