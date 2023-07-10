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


def process(data):
    titles = []
    for title, link in data:
        title = title.removeprefix("CERN Bulletin Issue No. ")
        title = parse_title(title)
        print(title, link)
        titles.append(title)

        if isinstance(title[0], tuple):
            (year1, issues1), (year2, issues2) = title
            if year1 > 1989:
                continue

            raise Exception("???")

            text = requests.get(link)

            if len(issues1) == 1:
                t = issues1[0]
            else:
                t = f"{issues1[0]}-{issues1[-1]}"
            p = Path(__file__).parent / "../bulletin/public/issues" / f"{t}_{year1}.pdf"
            p.write_text(text, encoding="utf-8")
            if len(issues2) == 1:
                t = issues2[0]
            else:
                t = f"{issues2[0]}-{issues2[-1]}"
            p = Path(__file__).parent / "../bulletin/public/issues" / f"{t}_{year2}.pdf"
            p.write_text(text, encoding="utf-8")
        else:
            year, issues = title
            if year > 1989:
                continue
            if not issues:
                continue

            if len(issues) == 1:
                t = issues[0]
            else:
                t = f"{issues[0]}-{issues[-1]}"

            if len(issues) == 1:
                tt = str(issues[0]).zfill(2)
            else:
                tt = f"{str(issues[0]).zfill(2)}-{str(issues[-1]).zfill(2)}"

            print("LINK", link.replace("https", "http") + f"/files/{tt}-{year}.pdf")
            # response = urllib.request.urlopen(link + f"/files/{tt}-{year}.pdf")
            text = requests.get(link.replace("https", "http") + f"/files/{tt}-{year}.pdf", headers={
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.47 Safari/537.36'
            }).text
            p = Path(__file__).parent / "../bulletin/public/issues" / f"{t}_{year}.pdf"
            p.write_text(text, encoding="utf-8")

        time.sleep(1)


    # titles_by_year = defaultdict(list)
    # for title in titles:
    #     if isinstance(title[0], tuple):
    #         print("TITLE", title)
    #         (year1, issues1), (year2, issues2) = title
    #         titles_by_year[year1].append(issues1)
    #         titles_by_year[year2].append(issues2)
    #     else:
    #         print("TITEL", title)
    #         year, issues = title
    #         if issues:
    #             titles_by_year[year].append(issues)

    # for year in titles_by_year:
    #     titles_by_year[year].sort()

    # (Path(__file__).parent / "processed_issues.json").write_text(json.dumps(titles_by_year))


data = json.loads((Path(__file__).parent / "../issues.json").read_text())
process(data)

# url = 'http://example.com/'
# response = urllib.request.urlopen(url)
# data = response.read()      # a `bytes` object
# text = data.decode('utf-8') # a `str`; this step can't be used if data is binary
