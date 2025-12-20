import { Link } from "react-router-dom";
function Linkto({ page }) {
  return (
    <Link to={"/" + page} className="Link">
      {page}
    </Link>
  );
}
export default Linkto;
