import "./main.scss";

import { useRef, useState } from "react";
import issues from "./processed_issues.json";

const formatIssues = (year, issues) => {
  if (issues.length === 1) {
    return `${issues[0]}`;
  } else {
    return `${issues[0]}-${issues.at(-1)}`;
  }
};

const hasSeparateLanguages = (year) => {
  return year >= 2009;
};

function Browse({
  issues,
  selectedYear,
  selectedIssue,
  selectedLanguage,
  setSelectedYear,
  setSelectedIssue,
  setSelectedLanguage,
}) {
  const [expanded, setExpanded] = useState(true);
  const ref = useRef();

  const years = Object.keys(issues).map((y) => parseInt(y, 10));
  const currentIssues = issues[selectedYear];

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

  const onSelectYear = (year) => () => {
    setSelectedYear(year);
    setSelectedLanguage("en");
  };

  return (
    <div className="block">
      <div className="box">
        <div className="header" onClick={onExpand}>
          <h4 className="title is-4">Browse</h4>
          <div>
            <i className={`icon-arrow-left ${expanded ? "expanded" : ""}`}></i>
          </div>
        </div>
        <div
          className="scroll-wrapper"
          ref={ref}
          onTransitionEnd={transitionEnd}
        >
          <div className="subheader">
            <h2 className="subtitle">Year</h2>
          </div>
          <div className="years">
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
                    onClick={onSelectYear(year)}
                  >
                    {year}
                  </button>
                </div>
              );
            })}
          </div>
          <div className="subheader">
            <h2 className="subtitle">Issue</h2>
            {hasSeparateLanguages(selectedYear) && (
              <div
                className={`buttons has-addons is-centered ${
                  expanded ? "expanded" : ""
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className={`button ${
                    selectedLanguage === "en" ? "is-dark" : ""
                  }`}
                  onClick={() => setSelectedLanguage("en")}
                >
                  EN
                </button>
                <button
                  className={`button ${
                    selectedLanguage === "fr" ? "is-dark" : ""
                  }`}
                  onClick={() => setSelectedLanguage("fr")}
                >
                  FR
                </button>
              </div>
            )}
          </div>
          <div className="issues">
            {currentIssues.map((issues) => {
              issues = formatIssues(selectedYear, issues);

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
    </div>
  );
}

function Search({
  setSelectedYear,
  setSelectedIssue,
  setSelectedPage,
  setSelectedLanguage,
}) {
  const [searchResults, setSearchResults] = useState([]);
  const [offset, setOffset] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [isLoadingInitial, setIsLoadingInitial] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
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

  const fetchResults = async (q, offset = 0) => {
    const response = await fetch(
      `/api/search?q=${searchValue}&offset=${offset}`
    );
    return await response.json();
  };

  const isLoading = isLoadingInitial || isLoadingMore;

  const onSearch = async (e) => {
    e.preventDefault();
    if (isLoading) {
      return;
    }

    setOffset(0); // reset offset
    setIsLoadingInitial(true);
    try {
      const results = await fetchResults(searchValue);
      setSearchResults(results);
      if (results.length < 5) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      setHasMore(true);
    } catch (e) {
      setSearchResults([]);
    } finally {
      setIsLoadingInitial(false);
    }
  };

  const onMore = async (e) => {
    if (isLoading) {
      return;
    }

    setIsLoadingMore(true);
    const newOffset = offset + 5;
    setOffset(newOffset); // increase offset

    try {
      const results = await fetchResults(searchValue, newOffset);
      setSearchResults((v) => [...v, ...results]);
      if (results.length === 0) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (e) {
      setSearchResults([]);
      setOffset(0);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const onResultClick = (year, issues, page, language) => (e) => {
    setSelectedYear(year);
    setSelectedIssue(issues);
    setSelectedPage(page);
    if (language === "en-fr") {
      setSelectedLanguage("");
    } else {
      setSelectedLanguage(language);
    }
  };

  return (
    <div className="block">
      <div className="box">
        <div className="header" onClick={onExpand}>
          <h4 className="title is-4">Search</h4>
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
              <form className="control" onSubmit={onSearch}>
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
                    className={`button is-link ${
                      isLoadingInitial ? "is-loading" : ""
                    }`}
                    onClick={onSearch}
                    type="submit"
                  >
                    <span className="icon is-small">
                      <i className="icon-magnifier"></i>
                    </span>
                    <span>Search</span>
                  </button>
                  <input type="submit" hidden />
                </div>
              </form>
            </div>
            <div className="block results">
              {searchResults.map(
                ({ year, issues, page, language, headline }, i) => (
                  <div key={`${i}-${headline}`} className="result-numbered">
                    <div>{i + 1}</div>
                    <div
                      className="box result"
                      onClick={onResultClick(year, issues, page, language)}
                    >
                      <div
                        className="tags has-addons"
                        style={{ flexWrap: "nowrap" }}
                      >
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
                  </div>
                )
              )}
              {hasMore && searchResults.length > 0 && (
                <div className="load-more">
                  <button
                    className={`button is-link ${
                      isLoadingMore ? "is-loading" : ""
                    }`}
                    onClick={onMore}
                  >
                    More..
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Main() {
  const [selectedYear, setSelectedYear] = useState(1965);
  const [selectedIssue, setSelectedIssue] = useState("1");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedPage, setSelectedPage] = useState(1);

  const languageSuffix = selectedLanguage ? `_${selectedLanguage}` : "";
  const data = `${process.env.PUBLIC_URL}/issues/${selectedYear}/${selectedIssue}${languageSuffix}.pdf?#page=${selectedPage}`;

  console.log(selectedYear, selectedIssue);

  return (
    <div className="columns main">
      <div className="column is-4 left-column">
        <Browse
          issues={issues}
          selectedYear={selectedYear}
          selectedIssue={selectedIssue}
          selectedLanguage={selectedLanguage}
          setSelectedYear={setSelectedYear}
          setSelectedIssue={setSelectedIssue}
          setSelectedLanguage={setSelectedLanguage}
        />
        <Search
          setSelectedYear={setSelectedYear}
          setSelectedIssue={setSelectedIssue}
          setSelectedPage={setSelectedPage}
          setSelectedLanguage={setSelectedLanguage}
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
