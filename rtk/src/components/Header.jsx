import { Link } from "react-router-dom";
const Header = () => {
  return (
    <header>
      <ul>
        <li>
          <Link to="/orders">Orders</Link>
        </li>
        <li>
          <Link to="/orders/add">Add Order</Link>
        </li>
        <li>
          <Link to="/users">Users</Link>
        </li>
        <li>
          <Link to="/users/add">Add User</Link>
        </li>
      </ul>
    </header>
  );
};

export default Header;
