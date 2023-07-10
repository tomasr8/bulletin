import "./main.scss";

import { useState } from "react";
import issues from "./processed_issues.json";

function Years({ years, selectedYear, setSelectedYear }) {
  const classes = {
    196: "is-link",
    197: "is-warning",
    198: "is-danger",
    199: "is-success",
    200: "is-link",
    201: "is-warning",
    202: "is-danger",
  };

  return (
    <div className="block">
      <h3 className="title">Year</h3>
      <div className="years">
        {years.map((year) => (
          <div key={year} className="year">
            <button
              className={`button ${selectedYear === year ? "" : "is-light"} ${
                classes[Math.floor(year / 10)]
              }`}
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Issues({ issues, selectedYear, selectedIssue, setSelectedIssue }) {
  const currentIssues = issues[selectedYear];

  const makeTitle = (issues) => {
    if (issues.length === 1) {
      return issues[0];
    } else {
      return `${issues[0]}-${issues.at(-1)}`;
    }
  };

  return (
    <div className="block">
      <h3 className="title">Issue</h3>
      <div className="issues">
        {currentIssues.map((issues) => (
          <button
            key={makeTitle(issues)}
            className={`button is-link ${
              selectedIssue === makeTitle(issues) ? "" : "is-light"
            }`}
            onClick={() => setSelectedIssue(makeTitle(issues))}
          >
            {makeTitle(issues)}
          </button>
        ))}
      </div>
    </div>
  );
}

function Timeline({
  years,
  issues,
  selectedYear,
  selectedIssue,
  setSelectedYear,
  setSelectedIssue,
}) {
  return (
    <div className="timeline">
      <Years
        years={years}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
      />
      <Issues
        issues={issues}
        selectedYear={selectedYear}
        selectedIssue={selectedIssue}
        setSelectedIssue={setSelectedIssue}
      />
    </div>
  );
}

export default function Main() {
  const [selectedYear, setSelectedYear] = useState(1965);
  const [selectedIssue, setSelectedIssue] = useState(1);

  const years = Object.keys(issues);

  const data = `${process.env.PUBLIC_URL}/issues/${selectedIssue}-${selectedYear}.pdf`;
  console.log("DATA", data);

  const onClick = async () => {
    const response = await fetch("/api/search?q=xxx");
    const json = await response.json();
    console.log(json);
  };

  return (
    <div className="columns main">
      <div className="column is-4">
        <Timeline
          years={years}
          issues={issues}
          selectedYear={selectedYear}
          selectedIssue={selectedIssue}
          setSelectedYear={setSelectedYear}
          setSelectedIssue={setSelectedIssue}
        />
        <div className="block">
          <div className="field">
            <div className="control">
              <input
                className="input"
                type="email"
                placeholder="e.g. alex@example.com"
              />
            </div>
            <button className="button is-link" onClick={onClick}>
              Search
            </button>
          </div>
        </div>
        <div className="block">
          <div className="box">
            <span class="tag is-link is-light">1965/4</span>Higgs Boson
          </div>
          <div className="box">
            <span class="tag is-link is-light">1970/3-4</span>Higgs Boson
          </div>
          <div className="box">
            <span class="tag is-link is-light">1984/7</span>Higgs Boson
          </div>
          <div className="box">
            <span class="tag is-link is-light">1992/22</span>Higgs Boson
          </div>
        </div>
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
