import "./main.scss";

import { useEffect, useRef, useState } from "react";
import issues from "./processed_issues.json";

const formatIssues = (year, issues) => {
  if (issues.length === 1) {
    return `${issues[0]}`;
  } else {
    return `${issues[0]}-${issues.at(-1)}`;
  }
};

function Years({ issues, selectedYear, setSelectedYear }) {
  const [expanded, setExpanded] = useState(true);
  const ref = useRef();

  const years = Object.keys(issues).map((y) => parseInt(y, 10));

  const classes = {
    196: "is-warning",
    197: "is-primary",
    198: "is-link",
    199: "is-warning",
    200: "is-primary",
    201: "is-link",
    202: "is-warning",
  };

  // const classes = {
  //   196: "is-dark is-light",
  //   197: "is-dark is-light",
  //   198: "is-dark is-light",
  //   199: "is-dark is-light",
  //   200: "is-dark is-light",
  //   201: "is-dark is-light",
  //   202: "is-dark is-light",
  // };

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

  return (
    <div className="block">
      <div className="box">
        <h3 className="title" onClick={onExpand}>
          Year
        </h3>
        <div className="years" ref={ref} onTransitionEnd={transitionEnd}>
          {years.map((year) => {
            const hasIssues = issues[year].length > 0;

            if (!hasIssues) {
              return (
                <div key={year} className="year">
                  <button disabled className={`button is-white`}>
                    {year}
                  </button>
                </div>
              );
            }

            return (
              <div key={year} className="year">
                <button
                  className={`button ${
                    selectedYear === year ? "" : "is-light"
                  } ${classes[Math.floor(year / 10)]}`}
                  onClick={() => setSelectedYear(year)}
                >
                  {year}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Issues({ issues, selectedYear, selectedIssue, setSelectedIssue }) {
  const [expanded, setExpanded] = useState(true);
  const ref = useRef();
  const currentIssues = issues[selectedYear];

  const onExpand = () => {
    if (expanded) {
      ref.current.style.height = `${ref.current.scrollHeight}px`;
      setTimeout(() => {
        ref.current.style.height = 0;
        ref.current.style.paddingTop = 0;
      }, 0);
    } else {
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
    setExpanded((exp) => !exp);
  };

  const transitionEnd = () => {
    if (expanded) {
      ref.current.style.height = "auto";
      ref.current.style.paddingTop = "1.5rem";
    }
  };

  return (
    <div className="block">
      <div className="box">
        <div className="header">
          <h3 className="title" onClick={onExpand}>
            Issue №
          </h3>
          <div class="tabs is-toggle">
            <ul>
              <li class="is-active">
                <a>
                  <span style={{ fontSize: 24, paddingRight: "0.5em" }}>
                    🇬🇧
                  </span>{" "}
                  <span>English</span>
                </a>
              </li>
              <li>
                <a>
                  <span style={{ fontSize: 24, paddingRight: "0.5em" }}>
                    🇫🇷
                  </span>{" "}
                  <span>French</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="issues" ref={ref} onTransitionEnd={transitionEnd}>
          {currentIssues.map((issues) => {
            issues = formatIssues(selectedYear, issues);

            if (selectedYear < 2009) {
              return (
                <button
                  key={issues}
                  className={`button is-link ${
                    selectedIssue === issues ? "" : "is-light"
                  }`}
                  onClick={() => setSelectedIssue(issues)}
                >
                  {issues}
                </button>
              );
            } else {
              const en = `${issues}_en`;
              const fr = `${issues}_fr`;

              return (
                <>
                  <button
                    key={en}
                    className={`button is-link ${
                      selectedIssue === en ? "" : "is-light"
                    }`}
                    onClick={() => setSelectedIssue(en)}
                  >
                    <span style={{ fontSize: 24, paddingRight: "0.5em" }}>
                      🇬🇧
                    </span>
                    {`${issues}`}
                  </button>
                  <button
                    key={fr}
                    className={`button is-link ${
                      selectedIssue === fr ? "" : "is-light"
                    }`}
                    onClick={() => setSelectedIssue(fr)}
                  >
                    <span style={{ fontSize: 24, paddingRight: "0.5em" }}>
                      🇫🇷
                    </span>
                    {`${issues}`}
                  </button>
                  {/* <div
                    key={en}
                    className="buttons has-addons"
                    onClick={() => setSelectedIssue(en)}
                  >
                    <button
                      className={`button is-link static ${
                        selectedIssue === en ? "" : "is-light"
                      }`}
                    >
                      <span style={{ fontSize: 24 }}>🇬🇧</span>
                    </button>
                    <button
                      className={`button is-link ${
                        selectedIssue === en ? "" : "is-light"
                      }`}
                    >
                      {issues}
                    </button>
                  </div> */}
                  {/* <div className="buttons has-addons">
                    <button className="button is-light is-link is-static">
                      en
                    </button>
                    <button className="button is-light is-link">
                      {issues}
                    </button>
                  </div> */}
                </>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}

function Search({ setSelectedYear, setSelectedIssue }) {
  const [searchResults, setSearchResults] = useState([]);
  const [offset, setOffset] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
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

  const onSubmit = async (e) => {
    e.preventDefault();
    setOffset(0);
    setLoading(true);
    const response = await fetch(`/api/search?q=${searchValue}&offset=0`);
    try {
      const json = await response.json();
      setSearchResults(json);
      console.log(json);
    } catch (e) {
      setSearchResults([]);
      setOffset(0);
    } finally {
      setLoading(false);
    }
  };

  const onMore = async (e) => {
    setOffset((v) => v + 5);
    setLoading(true);
    console.log("OFFSET", offset + 5);
    const response = await fetch(
      `/api/search?q=${searchValue}&offset=${offset + 5}`
    );
    try {
      const json = await response.json();
      setSearchResults((r) => [...r, ...json]);
      console.log(json);
    } catch (e) {
      setSearchResults([]);
      setOffset(0);
    } finally {
      setLoading(false);
    }
  };

  const onResultClick = (year, issues) => (e) => {
    setSelectedYear(year);
    setSelectedIssue(issues);
  };

  return (
    <div className="block">
      <div className="box">
        <h3 className="title" onClick={onExpand}>
          Search
        </h3>
        <div className="search" ref={ref} onTransitionEnd={transitionEnd}>
          <div className="block">
            <form className="control" onSubmit={onSubmit}>
              <div className="field">
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    placeholder="e.g. Higgs Boson"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </div>
                <button
                  className="button is-link"
                  onClick={onSubmit}
                  type="submit"
                >
                  Search
                </button>
                <input type="submit" hidden />
              </div>
            </form>
          </div>
          <div className="block results">
            {loading && (
              <progress className="progress is-primary" max="100"></progress>
            )}
            {!loading && (
              <>
                {searchResults.map(
                  ({ year, issues, page, language, headline }) => (
                    <div
                      key={headline}
                      className="box result"
                      onClick={onResultClick(year, issues)}
                    >
                      <div
                        className="tags has-addons"
                        style={{ flexWrap: "nowrap" }}
                      >
                        {/* {language === "en" && (
                          <span className="tag is-medium is-light is-link">
                            <span style={{ fontSize: 22 }}>🇬🇧</span>
                          </span>
                        )}
                        {language === "fr" && (
                          <span className="tag is-medium is-light is-link">
                            <span style={{ fontSize: 22 }}>🇫🇷</span>
                          </span>
                        )} */}
                        <span className="tag is-medium is-primary">{year}</span>
                        <span className="tag is-medium is-link">
                          {issues.split("_")[0]}
                        </span>
                        <span className="tag is-medium is-warning">{page}</span>
                      </div>
                      <span
                        dangerouslySetInnerHTML={{ __html: headline }}
                      ></span>
                    </div>
                  )
                )}
                {searchResults.length > 0 && (
                  <button className="button is-link" onClick={onMore}>
                    More..
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Main() {
  const [selectedYear, setSelectedYear] = useState(1965);
  const [selectedIssue, setSelectedIssue] = useState("1");

  const data = `${process.env.PUBLIC_URL}/issues/${selectedYear}/${selectedIssue}.pdf`;

  console.log(selectedYear, selectedIssue);

  return (
    <div className="columns main">
      <div className="column is-4 left-column">
        <Years
          issues={issues}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
        />
        <Issues
          issues={issues}
          selectedYear={selectedYear}
          selectedIssue={selectedIssue}
          setSelectedIssue={setSelectedIssue}
        />
        <Search
          setSelectedYear={setSelectedYear}
          setSelectedIssue={setSelectedIssue}
        />
      </div>
      <div className="column">
        <div className="viewer">
          <object data={data} type="application/pdf">
            Failed to load PDF
          </object>
        </div>
      </div>
    </div>
  );
}
