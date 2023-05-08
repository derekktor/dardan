import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const DashFooter = () => {
  const {userId, name, status} = useAuth();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const onGoHomeClicked = () => navigate("/dash");

  let goHomeBtn = null;
  if (pathname !== "/dash") {
    goHomeBtn = (
      <button
        className="dash-footer__button icon-button"
        title="Home"
        onClick={onGoHomeClicked}
      >
        Home
      </button>
    );
  }

  const content = (
    <footer className="dash-footer">
      {goHomeBtn}
      <p>Current User: {name}</p>
      <p>Status: {status}</p>
    </footer>
  );
  return content;
};

export default DashFooter;
