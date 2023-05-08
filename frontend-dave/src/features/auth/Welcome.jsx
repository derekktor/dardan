import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Welcome = () => {
  const { name, isAdmin } = useAuth();

  const date = new Date();
  const today = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "long",
  }).format(date);

  const content = (
    <section className="welcome">
      <p>{today}</p>
      <h1>Өдрийн мэнд! {name}</h1>
      {isAdmin && (
        <p>
          <Link to="/dash/users">Users</Link>
        </p>
      )}
      {isAdmin && (
        <p>
          <Link to="/dash/users/add">User+</Link>
        </p>
      )}
      <p>
        <Link to="/dash/orders">Orders</Link>
      </p>
      <p>
        <Link to="/dash/orders/add">Order+</Link>
      </p>
    </section>
  );
  return content;
};

export default Welcome;
