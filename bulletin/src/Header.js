export default function Header() {
  return (
    <nav
      className="navbar nav is-dark"
      role="navigation"
      aria-label="main navigation"
    >
      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-start">
          <a className="navbar-item">CERN CDS</a>
          <a className="navbar-item">Github</a>
          <a className="navbar-item" href="/">
            Explore
          </a>
          <a className="navbar-item" href="/history">
            Cover design
          </a>
          <a className="navbar-item" href="/articles">
            Interesting articles
          </a>
        </div>
      </div>
    </nav>
  );
}
