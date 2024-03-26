import "./main.scss"

import { useRef, useState } from "react"
import issues from "./issues.json"
import { isMobileChrome } from "./util"

const years = Object.keys(issues).map(y => parseInt(y, 10))

const formatIssues = (year, issues) => {
  if (issues.length === 1) {
    return `${issues[0]}`
  } else {
    return `${issues[0]}-${issues.at(-1)}`
  }
}

const hasSeparateLanguages = year => {
  return year >= 2009
}

const hasIssues = yearIssues => {
  const has = issues => issues.some(issue => issue.exists)
  return (
    has(yearIssues["en-fr"] || []) ||
    has(yearIssues["en"] || []) ||
    has(yearIssues["fr"] || [])
  )
}

const getClosestIssue = (yearIssues, currentIssue) => {
  currentIssue = currentIssue.split("-").map(n => parseInt(n, 10))

  function getDist(i1, i2) {
    if (i1.length === 1 && i2.length === 1) {
      return Math.abs(i1 - i2)
    } else if (i1.length === 1) {
      return Math.abs(i2.at(0) - i1) + Math.abs(i1 - i2.at(-1))
    } else if (i2.length === 1) {
      return Math.abs(i1.at(0) - i2) + Math.abs(i2 - i1.at(-1))
    } else {
      return Math.abs(i1.at(0) - i2.at(0)) + Math.abs(i1.at(-1) - i2.at(-1))
    }
  }

  const dist = yearIssues.map(issue => [
    issue,
    getDist(issue.issue, currentIssue)
  ])
  dist.sort((a, b) => a[1] - b[1])
  return dist.find(([issue, _]) => issue.exists)[0].issue
}

function Browse({
  issues,
  selectedYear,
  selectedIssue,
  selectedLanguage,
  setSelectedYear,
  setSelectedIssue,
  setSelectedLanguage
}) {
  const [expanded, setExpanded] = useState(true)
  const ref = useRef()

  const currentIssues = issues[selectedYear]

  const onExpand = () => {
    if (expanded) {
      ref.current.style.height = `${ref.current.scrollHeight}px`
      setTimeout(() => {
        ref.current.style.height = 0
      }, 0)
    } else {
      ref.current.style.height = `${ref.current.scrollHeight}px`
    }
    setExpanded(exp => !exp)
  }

  const transitionEnd = () => {
    if (expanded) {
      ref.current.style.height = "auto"
    }
  }

  const onSelectYear = year => () => {
    setSelectedYear(year)
    const issue = getClosestIssue(
      issues[year]["en-fr"] || issues[year]["en"],
      selectedIssue
    )

    if (hasSeparateLanguages(year)) {
      if (selectedLanguage === "en-fr") {
        setSelectedLanguage("en")
      }
    } else {
      setSelectedLanguage("en-fr")
    }
    setSelectedIssue(formatIssues(year, issue))
  }

  const onSelectLanguage = language => () => {
    const issue = getClosestIssue(issues[selectedYear][language], selectedIssue)
    setSelectedLanguage(language)
    setSelectedIssue(formatIssues(selectedYear, issue))
  }

  const yearsTotal = years.length

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
            {years.map((year, i) => {
              if (!hasIssues(issues[year])) {
                return (
                  <div key={year} className="year">
                    <button
                      disabled
                      className="button is-white"
                      title="Not available"
                    >
                      {year}
                    </button>
                  </div>
                )
              }

              const hue = Math.round((i / yearsTotal) * 360)
              const bgColor = `hsl(${hue}, 100%, 96%)`
              const fontColor = `hsl(${hue}, 100%, 29%)`

              const darkBgColor = `hsl(${hue}, 53%, 51%)`
              const darkFontColor = "#fff"

              const style =
                selectedYear === year
                  ? {
                      backgroundColor: darkBgColor,
                      color: darkFontColor
                    }
                  : {
                      backgroundColor: bgColor,
                      color: fontColor
                    }

              return (
                <div key={year} className="year">
                  <button
                    className={`button is-year ${
                      selectedYear === year ? "dark" : ""
                    }`}
                    style={style}
                    onClick={onSelectYear(year)}
                  >
                    {year}
                  </button>
                </div>
              )
            })}
          </div>
          <div className="subheader">
            <h2 className="subtitle">
              Issues{" "}
              <span className="tag is-medium is-rounded">
                {currentIssues[selectedLanguage].length}
              </span>
            </h2>
            {hasSeparateLanguages(selectedYear) && (
              <div
                className={`buttons has-addons is-centered ${
                  expanded ? "expanded" : ""
                }`}
                onClick={e => e.stopPropagation()}
              >
                <button
                  className={`button ${
                    selectedLanguage === "en" ? "is-primary" : ""
                  }`}
                  onClick={onSelectLanguage("en")}
                >
                  EN
                </button>
                <button
                  className={`button ${
                    selectedLanguage === "fr" ? "is-primary" : ""
                  }`}
                  onClick={onSelectLanguage("fr")}
                >
                  FR
                </button>
              </div>
            )}
          </div>
          <div className="issues">
            {currentIssues[selectedLanguage].map(({ issue, exists }) => {
              issue = formatIssues(selectedYear, issue)

              if (!exists) {
                return (
                  <button
                    key={issue}
                    className="button is-white"
                    title="Not available"
                    disabled
                  >
                    {issue}
                  </button>
                )
              }

              return (
                <button
                  key={issue}
                  className={`button is-link ${
                    selectedIssue === issue ? "" : "is-light"
                  }`}
                  onClick={() => setSelectedIssue(issue)}
                  disabled={!exists}
                >
                  {issue}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function Search({
  setSelectedYear,
  setSelectedIssue,
  setSelectedPage,
  setSelectedLanguage
}) {
  const [searchResults, setSearchResults] = useState([])
  const [offset, setOffset] = useState(0)
  const [searchValue, setSearchValue] = useState("")
  const [isLoadingInitial, setIsLoadingInitial] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [selectedResult, setSelectedResult] = useState(null)
  const [expanded, setExpanded] = useState(true)
  const ref = useRef()

  console.log("searchResults", searchResults)

  const onExpand = () => {
    if (expanded) {
      ref.current.style.height = `${ref.current.scrollHeight}px`
      setTimeout(() => {
        ref.current.style.height = 0
      }, 0)
    } else {
      ref.current.style.height = `${ref.current.scrollHeight}px`
    }
    setExpanded(exp => !exp)
  }

  const transitionEnd = () => {
    if (expanded) {
      ref.current.style.height = "auto"
    }
  }

  const fetchResults = async (q, offset = 0) => {
    const response = await fetch(
      `/api/search?q=${searchValue}&offset=${offset}`
    )
    return await response.json()
  }

  const isLoading = isLoadingInitial || isLoadingMore

  const onSearch = async e => {
    e.preventDefault()
    if (isLoading) {
      return
    }

    setSelectedResult(null)
    setOffset(0) // reset offset
    setIsLoadingInitial(true)
    try {
      const results = await fetchResults(searchValue)
      setSearchResults(results)
      if (results.length < 5) {
        setHasMore(false)
      } else {
        setHasMore(true)
      }
      setHasMore(true)
    } catch (e) {
      setSearchResults([])
    } finally {
      setIsLoadingInitial(false)
    }
  }

  const onMore = async e => {
    if (isLoading) {
      return
    }

    setSelectedResult(null)

    setIsLoadingMore(true)
    const newOffset = offset + 5
    setOffset(newOffset) // increase offset

    try {
      const results = await fetchResults(searchValue, newOffset)
      setSearchResults(v => [...v, ...results])
      if (results.length < 5) {
        setHasMore(false)
      } else {
        setHasMore(true)
      }
    } catch (e) {
      setSearchResults([])
      setOffset(0)
    } finally {
      setIsLoadingMore(false)
    }
  }

  const onResultClick = (i, year, issues, page, language) => e => {
    setSelectedResult(i)
    setSelectedYear(year)
    setSelectedIssue(issues)
    setSelectedPage(page)
    setSelectedLanguage(language)
  }

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
                      onChange={e => setSearchValue(e.target.value)}
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
                  <div
                    key={`${i}-${headline}`}
                    className="result-numbered"
                    onClick={onResultClick(i, year, issues, page, language)}
                  >
                    <div>
                      <span
                        className={`tag is-medium ${
                          selectedResult === i ? "is-link" : "is-white"
                        } is-rounded`}
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
                        <span className="tag is-medium is-link">
                          {issues.split("_")[0]}
                        </span>
                        <span className="tag is-medium is-warning">{page}</span>
                      </div>
                      <span
                        style={{ wordBreak: "break-word" }}
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
  )
}

export default function Main() {
  const _y = years.filter(y => hasIssues(issues[y]))
  const randomYear = _y[Math.floor(Math.random() * _y.length)]
  const randomLanguage = issues[randomYear]["en-fr"] ? "en-fr" : "en"
  const _i = issues[randomYear][randomLanguage].filter(i => i.exists)
  const randomIssue = formatIssues(
    randomYear,
    _i[Math.floor(Math.random() * _i.length)].issue
  )

  const [selectedYear, setSelectedYear] = useState(randomYear)
  const [selectedIssue, setSelectedIssue] = useState(randomIssue)
  const [selectedLanguage, setSelectedLanguage] = useState(randomLanguage)
  const [selectedPage, setSelectedPage] = useState(1)

  const languageSuffix =
    selectedLanguage === "en-fr" ? "" : `_${selectedLanguage}`
  const data = `${process.env.PUBLIC_URL}/issues/${selectedYear}/${selectedIssue}${languageSuffix}.pdf?#page=${selectedPage}`

  return (
    <div className="app-wrapper">
      <div className="columns is-desktop main">
        <div className="column is-4-desktop left-column">
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
        <div className="column is-8-desktop">
          <div className="viewer">
            {isMobileChrome() ? (
              <object data={`https://drive.google.com/viewerng/viewer?embedded=true&url=https://bulletin.app.cern.ch${data}`} type="application/pdf">
                Failed to load PDF
              </object>
            ) : (
              <object data={data} type="application/pdf">
                Failed to load PDF
              </object>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
