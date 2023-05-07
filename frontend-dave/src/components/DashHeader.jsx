import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import { useEffect } from "react";

const DASH_REGEX = /^\/dash(\/)?$/;
const ORDERS_REGEX = /^\/dash\/orders(\/)?$/;
const USERS_REGEX = /^\/dash\/users(\/)?$/;

const DashHeader = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation();

  useEffect(() => {
    if (isSuccess) navigate("/");
  }, [isSuccess, navigate]);

  const onLogoutClicked = () => sendLogout();

  if (isLoading) return <p>Logging out...</p>;

  if (isError) return <p>Алдаа: {error.data?.message}</p>;

  let dashClass = null;
  if (
    !DASH_REGEX.test(pathname) &&
    !ORDERS_REGEX.test(pathname) &&
    !USERS_REGEX.test(pathname)
  ) {
    dashClass = "dash-header__container--small";
  }

  const content = (
    <header className="dash-header">
      <div className={`dash-header__container ${dashClass}`}>
        <Link to="/dash">
          <h1 className="dash-header__title">Dardan</h1>
        </Link>
        <nav className="dash-header__nav">
          <Link to="/dash/users/add">Add User</Link>
          <Link to="/dash/orders/add">Add Order</Link>
          <button
            className=""
            title="log out"
            onClick={() => sendLogout()}
          >
            Log Out
          </button>
        </nav>
      </div>
    </header>
  );

  return content;
};

export default DashHeader;
