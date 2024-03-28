import { useState } from "react"
import { Router, Link as RouterLink } from "react-router-dom"

import { ReactComponent as Logo } from "./cern.svg"

const useIsMobile = () => {
  const query = "screen and (max-width: 768px)"
  const [isMobile, setIsMobile] = useState(window.matchMedia(query).matches)
  window
    .matchMedia(query)
    .addEventListener("change", ({ matches }) => setIsMobile(matches))
  return isMobile
}

function Link({ href, text }) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {text}
    </a>
  )
}

export default function Footer() {
  const isMobile = useIsMobile()

  return (
    <footer className="footer">
      {!isMobile && (
        <div className="columns is-centered is-8 is-variable">
          <div className="column is-2-desktop">
            <div
              style={{
                margin: "0 auto",
                width: "fit-content",
                display: "flex",
                flexDirection: "column",
                gap: "0.7em"
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
                  GitHub source
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
                <RouterLink to="/disclaimer">Disclaimer</RouterLink>
              </div>
            </div>
          </div>
          <div className="column is-2-desktop">
            <div style={{ margin: "0 auto", width: "fit-content" }}>
              <Logo style={{ width: 150 }} />
            </div>
          </div>
        </div>
      )}
      {isMobile && (
        <div className="">
          <div style={{ fontWeight: "bold" }}>CERN Bulletin Online Archive</div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <div>
                created by{" "}
                <Link href="https://github.com/tomasr8" text="Tomas Roun" />
              </div>
              <div>
                <Link
                  href="https://github.com/tomasr8/bulletin"
                  text="GitHub source"
                />
              </div>
              <div>
                <Link
                  href="https://cds.cern.ch/search?p=&action_search=H%C4%BEadaj&op1=a&m1=a&p1=&f1=&c=CERN+Bulletin+Issues&sf=year&so=a&rm=&rg=10&sc=0&of=hb"
                  text="CERN CDS"
                />
              </div>
              <div>
                <RouterLink to="/disclaimer">Disclaimer</RouterLink>
              </div>
            </div>
            <div>
              <Logo style={{ width: 80 }} />
            </div>
          </div>
        </div>
      )}
    </footer>
  )
}
