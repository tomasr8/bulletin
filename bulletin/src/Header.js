import { Routes, Route, Link } from "react-router-dom";

import { ReactComponent as Logo } from "./logo2.svg";

export default function Header() {
  return (
    <nav
      className="navbar nav is-dark"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <Link to="/" className="navbar-item">
          <Logo style={{ width: 55 }} />
        </Link>
      </div>
      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-start">
          <Link to="/" className="navbar-item">
            Explore
          </Link>
          <Link to="/covers" className="navbar-item">
            Cover design
          </Link>
          <Link to="/articles" className="navbar-item">
            Interesting articles
          </Link>
        </div>
      </div>
    </nav>
  );
}
