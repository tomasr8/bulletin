import "./main.scss";

import { useEffect, useRef, useState } from "react";
import issues from "./processed_issues.json";

const formatIssues = (issues) => {
  if (issues.length === 1) {
    return `${issues[0]}`;
  } else {
    return `${issues[0]}-${issues.at(-1)}`;
  }
};

function Years({ issues, selectedYear, setSelectedYear }) {
  const [expanded, setExpanded] = useState(true);
  const ref = useRef();

  const years = Object.keys(issues);

  const classes = {
    196: "is-warning",
    197: "is-primary",
    198: "is-link",
    199: "is-warning",
    200: "is-primary",
    201: "is-link",
    202: "is-warning",
  };

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
          Issue №
        </h3>
        <div className="issues" ref={ref} onTransitionEnd={transitionEnd}>
          {currentIssues.map((issues) => {
            issues = formatIssues(issues);
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
          })}
        </div>
      </div>
    </div>
  );
}

function Search({ setSelectedYear, setSelectedIssue }) {
  const [searchResults, setSearchResults] = useState([]);
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
    setLoading(true);
    const response = await fetch(`/api/search?q=${searchValue}`);
    try {
      const json = await response.json();
      setSearchResults(json);
      console.log(json);
    } catch (e) {
      setSearchResults([]);
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
                {searchResults.map(({ year, issues, headline }) => (
                  <div
                    key={headline}
                    className="box result"
                    onClick={onResultClick(year, issues)}
                  >
                    <span className="tag is-medium is-primary">
                      {year}/{issues}
                    </span>
                    <span dangerouslySetInnerHTML={{ __html: headline }}></span>
                  </div>
                ))}
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
