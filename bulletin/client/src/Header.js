import { Link } from "react-router-dom"

import { ReactComponent as Logo } from "./logo.svg"
import { useState } from "react"

export default function Header() {
  const [isActive, setIsActive] = useState(false)

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
        <button
          className={`navbar-burger ${isActive ? "is-active" : ""}`}
          aria-label="menu"
          aria-expanded={isActive}
          onClick={() => setIsActive(v => !v)}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>
      </div>
      <div className={`navbar-menu ${isActive ? "is-active" : ""}`}>
        <div className="navbar-start">
          <Link to="/" className="navbar-item">
            Explore
          </Link>
          <Link to="/covers" className="navbar-item">
            Cover design
          </Link>
          <Link to="/articles" className="navbar-item">
            Featured articles
          </Link>
          <Link to="/chat" className="navbar-item">
            Chat with the Bulletin
          </Link>
        </div>
      </div>
    </nav>
  )
}
