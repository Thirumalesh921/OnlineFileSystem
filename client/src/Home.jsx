import Linkto from "./Link";
import Greet from "./Greet";
import Form from "./Form";
import Desc from "./Desc";
import Title from "./Title";
import { Link } from "react-router-dom";

function Home({ data, handleChanges }) {
  if (!data.token) {
    return (
      <div className="page home-page">
        <div className="home-content">
          <Title title="Welcome to Online File System" />
          <Desc />
          <Link to={"/login"} className="home-hint">
            Get Started
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page dashboard">
      <Greet username={data.username} handleChanges={handleChanges} />
      <Form token={data.token} />
    </div>
  );
}

export default Home;
