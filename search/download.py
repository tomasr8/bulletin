import urllib.request
import json
from pathlib import Path
from collections import defaultdict
import time

import requests


def parse_segment(segment):
    issue, year = segment.split("/")
    year = int(year)
    if '-' in issue:
        first, last = issue.split("-")
        issues = list(range(int(first), int(last) + 1))
    else:
        issues = [int(issue)]
    return year, issues


def parse_title(title):
    if '&' in title:
        a, b = title.split(" & ")
        return parse_segment(a), parse_segment(b)
    else:
        return parse_segment(title)


def format_segment(year, issues, ext=True):
    if len(issues) == 1:
        segment = f"{str(issues[0]).zfill(2)}-{year}"
    else:
        segment = f"{str(issues[0]).zfill(2)}-{str(issues[-1]).zfill(2)}-{year}"
    return segment if not ext else f"{segment}.pdf"


def format_filename(title):
    if isinstance(title[0], tuple):
        (year1, issues1), (year2, issues2) = title
        return format_segment(year1, issues1), format_segment(year2, issues2)
    else:
        year, issues = title
        return format_segment(year, issues)


def process(data):
    titles = []
    for title, link in data:
        title = title.removeprefix("CERN Bulletin Issue No. ")
        title = parse_title(title)
        print(title, link)
        titles.append(title)

        # if isinstance(title[0], tuple):
        #     (year1, issues1), (year2, issues2) = title
        #     if year1 > 1989:
        #         continue

        #     filename_a, filename_b = format_filename(title)
        #     text = requests.get(link + f"/files/{filename_a}").content

        #     p = Path(__file__).parent / "../bulletin/public/issues/{year1}" / filename_a
        #     p.parent.mkdir(parents=True, exist_ok=True)
        #     p.write_text(text, encoding="utf-8")
        #     p = Path(__file__).parent / "../bulletin/public/issues/{year2}" / filename_b
        #     p.parent.mkdir(parents=True, exist_ok=True)
        #     p.write_text(text, encoding="utf-8")
        # else:
        #     year, issues = title
        #     if year > 1989:
        #         continue
        #     if not issues:
        #         continue

        #     filename = format_filename(title)
        #     text = requests.get(link + f"/files/{filename}").content
        #     p = Path(__file__).parent / "../bulletin/public/issues/{year}" / filename
        #     p.parent.mkdir(parents=True, exist_ok=True)
        #     p.write_text(text, encoding="utf-8")

        # time.sleep(1)


    titles_by_year = defaultdict(list)
    for title in titles:
        if isinstance(title[0], tuple):
            # print("TITLE", title)
            (year1, issues1), (year2, issues2) = title
            titles_by_year[year1].append(issues1)
            titles_by_year[year2].append(issues2)
        else:
            # print("TITEL", title)
            year, issues = title
            if issues:
                titles_by_year[year].append(issues)
            else:
                print("EMPTY", title)

    for year in titles_by_year:
        titles_by_year[year].sort()

    for year in titles_by_year:
        titles_by_year[year] = [format_segment(year, issues, ext=False) for issues in titles_by_year[year]]

    (Path(__file__).parent / "processed_issues.json").write_text(json.dumps(titles_by_year))


data = json.loads((Path(__file__).parent / "../issues.json").read_text())
process(data)
