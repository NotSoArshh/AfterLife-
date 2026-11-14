import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="footer">
    <div className="footer__top">
      <div className="footer__statement">
        <p className="eyebrow">Epilogue</p>
        <p className="footer__line">
          They are not lost.
          <br />
          <em>They are exactly where we left them.</em>
        </p>
      </div>
      <div className="footer__nav">
        <div>
          <p className="footer__head">Explore</p>
          <Link to="/archive">Archive</Link>
          <Link to="/timeline">Timeline</Link>
          <Link to="/moon">The Moon</Link>
          <Link to="/mars">Mars</Link>
          <Link to="/hardware">Hardware</Link>
          <Link to="/legacy">Scientific legacy</Link>
        </div>
        <div>
          <p className="footer__head">Research</p>
          <a href="https://nssdc.gsfc.nasa.gov/" target="_blank" rel="noreferrer">
            NSSDCA
          </a>
          <a href="https://science.nasa.gov/" target="_blank" rel="noreferrer">
            NASA Science
          </a>
          <a href="https://www.jpl.nasa.gov/" target="_blank" rel="noreferrer">
            NASA/JPL
          </a>
          <a href="https://images.nasa.gov/" target="_blank" rel="noreferrer">
            NASA Image Library
          </a>
          <Link to="/sources">All sources</Link>
        </div>
      </div>
    </div>

    <div className="footer__bottom">
      <span>AFTERLIFE — a prototype for the NASA Space Apps Challenge, “Abandoned but not Forgotten”.</span>
      <span className="footer__fine">
        Imagery: NASA / JPL, public domain, via the NASA Image and Video Library. An independent
        project — not affiliated with or endorsed by NASA.
      </span>
    </div>
  </footer>
);

export default Footer;
