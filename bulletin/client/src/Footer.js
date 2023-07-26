import { ReactComponent as Logo } from "./logo.svg";

import Disclaimer from "./Disclaimer";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="columns is-centered is-8 is-variable">
        <div className="column is-2-desktop">
          <div
            style={{
              margin: "0 auto",
              width: "fit-content",
              display: "flex",
              flexDirection: "column",
              gap: "0.7em",
            }}
          >
            <div>
              <div>
                <strong>CERN Bulletin Online Archive</strong>
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
            </div>
            <div>
              <a
                href="https://github.com/tomasr8/bulletin"
                target="_blank"
                rel="noreferrer"
              >
                Github source
              </a>
            </div>
            <div>
              <a
                href="https://cds.cern.ch/search?p=&action_search=H%C4%BEadaj&op1=a&m1=a&p1=&f1=&c=CERN+Bulletin+Issues&sf=year&so=a&rm=&rg=10&sc=0&of=hb"
                target="_blank"
                rel="noreferrer"
              >
                CERN CDS
              </a>
            </div>
            <div>
              <a>Disclaimer</a>
            </div>
          </div>
        </div>
        <div className="column is-2-desktop">
          <div style={{ margin: "0 auto", width: "fit-content" }}>
            <Logo style={{ width: 150 }} />
          </div>
        </div>
      </div>
    </footer>
  );
}
