import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import jwtDecode from "jwt-decode";

const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  let isAdmin = false;
  let status = "employee";

  if (token) {
    const decoded = jwtDecode(token);
    const { userId, name, roles } = decoded.UserInfo;
    const userIdUsable = userId?.toString();

    isAdmin = roles.includes("admin");

    if (isAdmin) status = "admin";

    // console.log(`useAuth: ${userId} - ${userIdUsable} - ${decoded}`)

    return { userIdUsable, name, roles, status, isAdmin };
  }

  return { name: "", roles: [], isAdmin, status };
};

export default useAuth;
