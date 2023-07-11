import { ReactComponent as Logo } from "./logo.svg";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="columns is-centered is-8 is-variable">
        <div className="column is-2-desktop">
          <div>
            <strong>CERN Bulletin online archive</strong>
          </div>
          <div>
            created by{" "}
            <a
              href="https://github.com/tomasr8"
              target="_blank"
              rel="noreferrer"
            >
              Tomas Roun
            </a>
          </div>
          <div style={{ marginTop: "1em" }}>
            <strong>Disclaimer</strong>
          </div>
          <div>
            The copyright to the CERN Bulletin issues is owned by the European
            Organization for Nuclear Research (CERN) and is protected under
            applicable intellectual property laws.
          </div>
        </div>
        <div className="column is-2-desktop">
          <Logo style={{ width: 150 }} />
        </div>
      </div>
    </footer>
  );
}
