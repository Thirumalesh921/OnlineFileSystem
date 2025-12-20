import { useReducer } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./SignUp";
import Login from "./Login";
import Home from "./Home";
import { FaFolderMinus } from "react-icons/fa";

function App() {
  console.count("App");
  const setStates = (state, action) => {
    switch (action.type) {
      case "setAuth":
        return { token: action.token, username: action.username };
      case "logOut":
        return { token: null, username: null };
    }
    return state;
  };
  const [data, handleChanges] = useReducer(setStates, {
    token: null,
    username: null,
  });
  return (
    <>
      <BrowserRouter>
        <div className="AppLayout">
          <header>
            <FaFolderMinus />
            <strong>Online File System</strong>
          </header>
          <Routes>
            <Route path="/SignUp" element={<SignUp />} />
            <Route
              path="/Login"
              element={<Login handleChanges={handleChanges} />}
            />
            <Route
              path="/"
              element={<Home data={data} handleChanges={handleChanges} />}
            />
          </Routes>
          <footer>Built with ❤️ using MERN stack</footer>
        </div>
      </BrowserRouter>
    </>
  );
}
export default App;
