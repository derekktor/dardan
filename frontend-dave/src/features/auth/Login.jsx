import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "./authApiSlice";
import { setCredentials } from "./authSlice";
import usePersist from "../../hooks/usePersist";

const Login = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const [persist, setPersist] = usePersist();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [name, password]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { accessToken } = await login({ name, password }).unwrap();
      dispatch(setCredentials({ accessToken }));
      setName("");
      setPassword("");
      navigate("/dash");
    } catch (error) {
      if (!error.status) {
        setErrMsg("No Server Response");
      } else if (error.status === 400) {
        setErrMsg("Нэр болон нууц үгээ оруулна уу");
      } else if (error.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg(error.data?.message);
      }

      errRef.current.focus();
    }
  };

  const handleToggle = () => setPersist((prev) => !prev);

  if (isLoading) return <p>Уншиж байна...</p>;

  const content = (
    <section className="public">
      <header>
        <h1>Нэвтрэх</h1>
      </header>
      <main className="login">
        <p
          ref={errRef}
          className={errMsg ? "errmsg" : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </p>
        <form className="form" onSubmit={handleLogin}>
          <div>
            <label htmlFor="name">Нэр:</label>
            <input
              type="text"
              className="form__input"
              id="name"
              ref={userRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="off"
              required
            />
          </div>
          <div>
            <label htmlFor="password">Нууц үг:</label>
            <input
              type="password"
              className="form__input"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
              required
            />
          </div>
          <button type="submit">Нэвтрэх</button>
          <label htmlFor="persist">
            <input
              type="checkbox"
              className="form__checkbox"
              id="persist"
              onChange={handleToggle}
              checked={persist}
            />
            Trust this device
          </label>
        </form>
      </main>
      <footer>
        <Link to="/">Home</Link>
      </footer>
    </section>
  );

  return content;
};

export default Login;
