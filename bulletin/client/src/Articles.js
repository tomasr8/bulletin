import { useRef, useState } from "react";

import styles from "./Articles.module.scss";

const articles = [
  {
    description: "The first true Cernois heralded by a comet",
    path: "1975_47.pdf",
    year: 1975,
    issue: "47",
  },
  {
    description:
      "CERN experiments observe particle consistent with long-sought Higgs boson",
    path: "2012_28-29.pdf",
    year: 2012,
    issue: "28-29",
  },
  {
    description: "First LEP break-through under the Jura",
    path: "1984_45.pdf",
    year: 1984,
    issue: "45",
  },
  {
    description: "A happy winner",
    path: "1982_45.pdf",
    year: 1982,
    issue: "45",
  },
  {
    description: "Quelle heure est-il?",
    path: "1976_15.pdf",
    year: 1976,
    issue: "15",
  },
  {
    description: "New CERN Courier: a real eyecatcher!",
    path: "1998_45.pdf",
    year: 1998,
    issue: "45",
  },
  {
    description: "1979 is Silver Jubilee Year",
    path: "1979_1-2.pdf",
    year: 1979,
    issue: "1-2",
  },
  {
    description: "First international conference on the World Wide Web",
    path: "1994_23.pdf",
    year: 1994,
    issue: "23",
  },
  {
    description: "Raindrops keep falling on my LEP",
    path: "1994_45.pdf",
    year: 1994,
    issue: "45",
  },
];

function Search({ selectedArticle, setSelectedArticle }) {
  const [expanded, setExpanded] = useState(true);
  const ref = useRef();

  const onExpand = () => {
    if (expanded) {
      ref.current.style.height = `${ref.current.scrollHeight}px`;
      setTimeout(() => {
        ref.current.style.height = 0;
      }, 0);
    } else {
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
    setExpanded((exp) => !exp);
  };

  const transitionEnd = () => {
    if (expanded) {
      ref.current.style.height = "auto";
    }
  };

  const onResultClick = (i) => (e) => {
    setSelectedArticle(i);
  };

  return (
    <div className="block">
      <div className="box">
        <div className="header" onClick={onExpand}>
          <h4 className="title is-4">Featured articles</h4>
          <div>
            <i className={`icon-arrow-left ${expanded ? "expanded" : ""}`}></i>
          </div>
        </div>
        <div
          className="scroll-wrapper"
          ref={ref}
          onTransitionEnd={transitionEnd}
        >
          <div className="search">
            <div className="block">
              A collection of articles I consider noteworthy and/or interesting.
              If you want to suggest another one,{" "}
              <a
                href="https://github.com/tomasr8/bulletin"
                target="_blank"
                rel="noreferrer"
              >
                let me know!
              </a>
            </div>
            <div className="block results">
              {articles.map(({ description, path, year, issue }, i) => (
                <div
                  key={i}
                  className="result-numbered"
                  onClick={onResultClick(i)}
                >
                  <div>
                    <span
                      className={`tag is-medium ${
                        selectedArticle === i ? "" : "is-white"
                      } is-rounded`}
                      style={
                        selectedArticle === i
                          ? { backgroundColor: "#8a8fa6", color: "white" }
                          : {}
                      }
                    >
                      {i + 1}
                    </span>
                  </div>
                  <div className="box result">
                    <div
                      className="tags has-addons"
                      style={{ flexWrap: "nowrap" }}
                    >
                      <span className="tag is-medium is-primary">{year}</span>
                      <span className="tag is-medium is-link">{issue}</span>
                    </div>
                    <span style={{ wordBreak: "break-word" }}>
                      {description}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Article() {
  const [selectedArticle, setSelectedArticle] = useState(0);

  const { path } = articles[selectedArticle];
  const data = `${process.env.PUBLIC_URL}/articles/${path}`;

  return (
    <div className="app-wrapper">
      <div className="columns is-desktop main">
        <div className="column is-4-desktop left-column">
          <Search
            selectedArticle={selectedArticle}
            setSelectedArticle={setSelectedArticle}
          />
        </div>
        <div className="column is-8-desktop">
          <div className="viewer">
            <object data={data} type="application/pdf">
              Failed to load PDF
            </object>
          </div>
        </div>
      </div>
    </div>
  );
}
