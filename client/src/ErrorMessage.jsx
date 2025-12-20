import { useEffect } from "react";

function Error({ error, setError }) {
  console.count("Error");
  useEffect(() => {
    console.log("Error at useEffect");
    if (error) {
      const id = setTimeout(() => {
        console.log("Interval at useEffect");
        setError(null);
      }, 3000);
      return () => clearTimeout(id);
    }
  }, [error]);

  return <p className="error">{error}</p>;
}

export default Error;
