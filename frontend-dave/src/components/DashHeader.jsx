import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import { useEffect } from "react";
import useAuth from "../hooks/useAuth";

const DASH_REGEX = /^\/dash(\/)?$/;
const ORDERS_REGEX = /^\/dash\/orders(\/)?$/;
const USERS_REGEX = /^\/dash\/users(\/)?$/;

const DashHeader = () => {
  const { name, isAdmin } = useAuth();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation();

  useEffect(() => {
    if (isSuccess) navigate("/");
  }, [isSuccess, navigate]);

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
          {isAdmin && <Link to="/dash/users">Хэрэглэгчид</Link>}
          {isAdmin && <Link to="/dash/users/add">Хэрэглэгч нэмэх</Link>}
          <Link to="/dash/orders/">Бүртгэлүүд</Link>
          <Link to="/dash/orders/add">Бүртгэл нэмэх</Link>
          <Link to="/dash/report">Тайлан</Link>
          <button title="log out" onClick={() => sendLogout()}>
            Гарах
          </button>
        </nav>
      </div>
    </header>
  );

  return content;
};

export default DashHeader;
