import { Link } from "react-router-dom";

const Public = () => {
  const content = (
    <section className="public">
      <header>
        <h1>
        Dardand Tavtai Moril
        </h1>
      </header>
      <main className="public__main">
      </main>
      <footer>
        <Link to="/login">Нэвтрэх</Link>
      </footer>
    </section>
  );
  return content;
};

export default Public;
