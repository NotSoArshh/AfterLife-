import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="notFound">
    <div className="wrap notFound__inner">
      <p className="eyebrow">Signal lost</p>
      <h1 className="notFound__code">404</h1>
      <p className="notFound__text">
        This page is not in the collection. It may have drifted out of range, or the link may have
        been mis-transmitted.
      </p>
      <div className="notFound__cta">
        <Link to="/" className="btn btn--gold">
          Return to the entrance
        </Link>
        <Link to="/archive" className="btn btn--line">
          Browse the archive
        </Link>
      </div>
    </div>
  </div>
);

export default NotFound;
