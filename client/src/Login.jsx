import axios from "axios";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Error from "./ErrorMessage";
import Desc from "./Desc";
import Title from "./Title";
import Linkto from "./Link";

function Login({ handleChanges }) {
  console.count("Login");
  const navigate = useNavigate();
  const username = useRef("");
  const password = useRef("");
  const [err, setError] = useState("");
  console.log(err, "Error");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        {
          username: username.current.value,
          password: password.current.value,
        }
      );
      username.current.value = "";
      password.current.value = "";
      console.log(res);
      if (res.data.status) {
        handleChanges({
          type: "setAuth",
          token: res.data.token,
          username: res.data.username,
        });
        navigate("/");
      } else {
        console.log("res");
        setError(res.data.message);
      }
      console.log("Submit");
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    username.current.focus();
  }, []);
  return (
    <>
      <div className="page auth-page">
        <div className="auth-left">
          <Title title="Login to your account" />
          <Desc />
        </div>

        <div className="auth-right">
          <h2>Login</h2>

          <form onSubmit={handleSubmit}>
            <label>Username</label>
            <input
              type="text"
              ref={username}
              placeholder="Enter Username"
              required
            />

            <label>Password</label>
            <input
              type="password"
              ref={password}
              placeholder="Enter Password"
              required
            />

            <input type="submit" value="Login" />
          </form>

          {err && <Error error={err} setError={setError} />}
          <div className="auth-switch">
            <p className="switch-text">Don't have an account?</p>
            <Linkto page="SignUp" />
          </div>
        </div>
      </div>
    </>
  );
}
export default Login;
