import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/orders">Orders</Link>
        </li>
        <li>
          <Link to="/users">Users</Link>
        </li>
        <li>
          Add
          <ul>
            <li>
              <Link to="/orders/add">Order</Link>
            </li>
            <li>
              <Link to="/users/add">User</Link>
            </li>
          </ul>
        </li>
      </ul>
    </header>
  );
};

export default Header;
