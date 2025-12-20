import axios from "axios";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Desc from "./Desc";
import Title from "./Title";
import Error from "./ErrorMessage";
import Linkto from "./Link";
function SignUp() {
  const navigate = useNavigate();
  const [err, setError] = useState("");
  const username = useRef(null);
  const password1 = useRef(null);
  const password2 = useRef(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/signup`,
        {
          username: username.current.value,
          password1: password1.current.value,
          password2: password2.current.value,
        }
      );
      console.log(res);
      username.current.value = "";
      password1.current.value = "";
      password2.current.value = "";
      if (res.data.status) {
        navigate("/login");
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      console.log("Error in Logging in");
    }
  };
  useEffect(() => {
    username.current.focus();
  }, []);
  return (
    <>
      <div className="page auth-page">
        <div className="auth-left">
          <Title title="Create your account" />
          <Desc />
        </div>

        <div className="auth-right">
          <h2>Sign Up</h2>

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
              ref={password1}
              placeholder="Enter password"
              required
            />

            <label>Confirm Password</label>
            <input
              type="password"
              ref={password2}
              placeholder="Retype password"
              required
            />

            <input type="submit" value="Sign Up" />
          </form>

          {err && <Error error={err} setError={setError} />}

          <div className="auth-switch">
            <p className="switch-text">Already have an account?</p>
            <Linkto page="Login" />
          </div>
        </div>
      </div>
    </>
  );
}
export default SignUp;
