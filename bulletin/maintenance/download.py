import json
import time
from collections import defaultdict
from pathlib import Path

import requests


ISSUES = Path(__file__).parents[1] / "client/public/issues"


def format_issue(issue: list[str]) -> str:
    if len(issue) == 1:
        return str(issue[0])
    return f"{issue[0]}-{issue[-1]}"


def fill_gaps(issues):
    last = issues[-1] if isinstance(issues[-1], int) else issues[-1][-1]

    i = 1
    curr = 0
    while i <= last:
        issue = issues[curr]
        if i < issue[0]:
            if i + 1 == issue[0]:
                yield (i,)
            else:
                yield (i, issue[0] - 1)
            i = issue[0]
        elif i == issue[0]:
            yield issue
            i = issue[-1] + 1
            curr += 1
        else:
            i = issues[curr][0]


def parse_title(title):
    title = title.removeprefix("CERN Bulletin Issue No. ")
    if "&" in title:
        a, b = title.split(" & ")
        yield parse_segment(a)
        yield parse_segment(b)
    else:
        yield parse_segment(title)


def parse_segment(segment):
    issue, year = segment.split("/")
    year = int(year)
    if "-" in issue:
        first, last = issue.split("-")
        issues = tuple(range(int(first), int(last) + 1))
    else:
        issues = (int(issue),)
    return year, issues


def format_segment(year, issues, *, ext, year_first):
    if len(issues) == 1:
        issue_range = str(issues[0]).zfill(2)
    else:
        start = str(issues[0]).zfill(2)
        end = str(issues[-1]).zfill(2)
        issue_range = f"{start}-{end}"
    segment = f"{year}-{issue_range}" if year_first else f"{issue_range}-{year}"
    return f"{segment}{ext}"


def format_filename(year, issues, ext=".pdf", year_first=False):  # noqa: FBT002
    return format_segment(year, issues, ext=ext, year_first=year_first)


def format_filename_pre_2009(year, issues):
    return format_filename(year, issues)


def format_filename_2009_2019(year, issues, *, is_french=False):
    if is_french:
        return format_filename(year, issues, ext="-F-web.pdf", year_first=True)
    return format_filename(year, issues, ext="-E-web.pdf", year_first=True)


def format_filename_post_2019(*, is_french=False):
    if is_french:
        return "CERN Bulletin Issue (French).pdf"
    return "CERN Bulletin Issue (English).pdf"


def get_links(base, year, issues):
    base = f"{base}/files"
    if year < 2009:
        filename = format_filename_pre_2009(year, issues)
        path = get_storage_path(year, issues)
        yield f"{base}/{filename}", path
    elif year < 2020:
        filename = format_filename_2009_2019(year, issues)
        path = get_storage_path(year, issues, ext="_en.pdf")
        yield f"{base}/{filename}", path
        filename = format_filename_2009_2019(year, issues, is_french=True)
        path = get_storage_path(year, issues, ext="_fr.pdf")
        yield f"{base}/{filename}", path
    else:
        filename = format_filename_post_2019()
        path = get_storage_path(year, issues, ext="_en.pdf")
        yield f"{base}/{filename}", path
        filename = format_filename_post_2019(is_french=True)
        path = get_storage_path(year, issues, ext="_fr.pdf")
        yield f"{base}/{filename}", path


def get_storage_path(year, issues, *, ext=".pdf"):
    if len(issues) == 1:
        return f"{year}/{issues[0]}{ext}"
    return f"{year}/{issues[0]}-{issues[-1]}{ext}"


def process(data):  # noqa: C901, PLR0912
    duplicates = set()

    all_issues = []
    for title, base in data:
        for year, issues in parse_title(title):
            assert len(issues) > 0
            assert (year, issues) not in duplicates

            duplicates.add((year, issues))
            all_issues.append((year, issues))

            for link, file_path in get_links(base, year, issues):
                print(link, file_path)
                pdf = requests.get(link).content  # noqa: S113
                path = ISSUES / file_path
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_bytes(pdf)
                time.sleep(1)
                print("done")

    issues_by_year = defaultdict(list)
    for year, issues in all_issues:
        issues_by_year[year].append(issues)

    for year in issues_by_year:
        issues_by_year[year].sort()

    processed_issues = {}
    for year, issues in issues_by_year.items():
        if year < 2009:
            processed_issues[year] = {
                "en-fr": [],
            }
        else:
            processed_issues[year] = {"en": [], "fr": []}

        print(year)
        for issue in fill_gaps(issues):
            if year < 2009:
                p = ISSUES / f"{year}/{format_issue(issue)}.pdf"
                if not p.is_file():
                    print(f"∟ Missing: {year}/{format_issue(issue)}")
                    processed_issues[year]["en-fr"].append({"issue": issue, "exists": False})
                else:
                    processed_issues[year]["en-fr"].append({"issue": issue, "exists": True})
            else:
                p_en = ISSUES / f"{year}/{format_issue(issue)}_en.pdf"
                p_fr = ISSUES / f"{year}/{format_issue(issue)}_fr.pdf"
                if not p_en.is_file():
                    print(f"∟ Missing(en): {year}/{format_issue(issue)}")
                    processed_issues[year]["en"].append({"issue": issue, "exists": False})
                else:
                    processed_issues[year]["en"].append({"issue": issue, "exists": True})
                if not p_fr.is_file():
                    print(f"∟ Missing(fr): {year}/{format_issue(issue)}")
                    processed_issues[year]["fr"].append({"issue": issue, "exists": False})
                else:
                    processed_issues[year]["fr"].append({"issue": issue, "exists": True})

    (Path(__file__).parent / "issues-processed.json").write_text(json.dumps(processed_issues))


if __name__ == "__main__":
    data = json.loads((Path(__file__).parent / "issues-raw.json").read_text())
    process(data)
