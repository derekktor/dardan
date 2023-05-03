import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getCount, increaseCount } from "../features/user/usersSlice";

const Header = () => {
  const dispatch = useDispatch();
  const count = useSelector(getCount);

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
        <button
          onClick={() => {
            dispatch(increaseCount());
          }}
        >
          {count}
        </button>
      </ul>
    </header>
  );
};

export default Header;
