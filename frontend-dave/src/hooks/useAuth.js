import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import jwtDecode from "jwt-decode";

const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  let isAdmin = false;
  let status = "employee";

  if (token) {
    const decoded = jwtDecode(token);
    const { name, roles } = decoded.UserInfo;

    isAdmin = roles.includes("admin");

    if (isAdmin) status = "admin";

    return { name, roles, status, isAdmin };
  }

  return { name: "", roles: [], isAdmin, status };
};

export default useAuth;
