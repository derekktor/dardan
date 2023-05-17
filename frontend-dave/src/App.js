import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/Login";
import DashLayout from "./components/DashLayout";
import Welcome from "./features/auth/Welcome";
import OrdersList from "./features/orders/OrdersList";
import UsersList from "./features/users/UsersList";
import AddUserForm from "./features/users/AddUserForm";
import EditUserForm from "./features/users/EditUserForm";
import SingleUser from "./features/users/SingleUser";
import AddOrderForm from "./features/orders/AddOrderForm";
import EditOrderForm from "./features/orders/EditOrderForm";
import SingleOrder from "./features/orders/SingleOrder";
import ReportLayout from "./features/report/ReportLayout"
import ReportDaily from "./features/report/ReportDaily"
import ReportMonthly from "./features/report/ReportMonthly"
import ReportAnnual from "./features/report/ReportAnnual"
import Prefetch from "./features/auth/Prefetch";
import PersistLogin from "./features/auth/PersistLogin";
import RequireAuth from "./features/auth/RequireAuth";
import { ROLES } from "./config/roles";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />
        {/* Protected routes */}
        <Route element={<PersistLogin />}>
          <Route
            element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}
          >
            <Route element={<Prefetch />}>
              <Route path="dash" element={<DashLayout />}>
                <Route index element={<Welcome />} />

                <Route path="orders">
                  <Route index element={<OrdersList />} />
                  <Route path="add" element={<AddOrderForm />} />
                  <Route path="edit/:orderId" element={<EditOrderForm />} />
                  <Route path=":orderId" element={<SingleOrder />} />
                </Route>

                <Route path="report" element={<ReportLayout />}>
                  <Route path="daily" element={<ReportDaily />} />
                  <Route path="monthly" element={<ReportMonthly />} />
                  <Route path="annual" element={<ReportAnnual />} />
                </Route>

                <Route element={<RequireAuth allowedRoles={[ROLES.admin]} />}>
                  <Route path="users">
                    <Route index element={<UsersList />} />
                    <Route path=":userId" element={<SingleUser />} />
                    <Route path="add" element={<AddUserForm />} />
                    <Route path="edit/:userId" element={<EditUserForm />} />
                  </Route>
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
      </Route>
    </Routes>
  );
};

export default App;
