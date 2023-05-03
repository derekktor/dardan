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
        <p>
          Located in Beautiful Downtown Foo City, Dan D. Repairs provides a
          trained staff ready to meet your tech repair needs.
        </p>
        <address className="public__addr">
          Zamiin Uud
          <br />
          <a href="tel:+15555555555">99095636</a>
        </address>
        <br />
        <p>Owner: Bayandelger</p>
      </main>
      <footer>
        <Link to="/login">Employee Login</Link>
        <Link to="/dash">Dev: Dash</Link>
      </footer>
    </section>
  );
  return content;
};

export default Public;
