import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Welcome = () => {
  const { userId, name, isAdmin } = useAuth();

  const navigate = useNavigate();

  const date = new Date();
  const today = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).format(date);

  const content = (
    <section className="welcome m">
      <p>{today}</p>
      <h1>Өдрийн мэнд! {name}</h1>
      {isAdmin && (
        <p>
          <Link to="/dash/users">Хэрэглэгчид</Link>
        </p>
      )}
      {isAdmin && (
        <p>
          <Link to="/dash/users/add">Хэрэглэгч нэмэх</Link>
        </p>
      )}
      <p>
        <Link to="/dash/orders">Бүртгэлүүд</Link>
      </p>
      <p>
        <Link to="/dash/orders/add">Бүртгэл нэмэх</Link>
      </p>
      <p>
        <Link to={`/dash/users/edit/${userId}`}>Өөрийн мэдээллийг өөрчлөх</Link>
      </p>
    </section>
  );
  return content;
};

export default Welcome;
