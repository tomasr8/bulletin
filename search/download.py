import json
from pathlib import Path
from collections import defaultdict
import time

import requests


def parse_title(title):
    title = title.removeprefix('CERN Bulletin Issue No. ')
    if '&' in title:
        a, b = title.split(' & ')
        yield parse_segment(a)
        yield parse_segment(b)
    else:
        yield parse_segment(title)


def parse_segment(segment):
    issue, year = segment.split('/')
    year = int(year)
    if '-' in issue:
        first, last = issue.split('-')
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
        issue_range = f'{start}-{end}'
    segment = f'{year}-{issue_range}' if year_first else f'{issue_range}-{year}'
    return f'{segment}{ext}'


def format_filename(year, issues, ext='.pdf', year_first=False):
    return format_segment(year, issues, ext=ext, year_first=year_first)


def format_filename_pre_2009(year, issues):
    return format_filename(year, issues)


def format_filename_2009_2019(year, issues, *, is_french=False):
    if is_french:
        return format_filename(year, issues, ext='-F-web.pdf', year_first=True)
    else:
        return format_filename(year, issues, ext='-E-web.pdf', year_first=True)


def format_filename_post_2019(*, is_french=False):
    if is_french:
        return 'CERN Bulletin Issue (French).pdf'
    else:
        return 'CERN Bulletin Issue (English).pdf'


def get_links(base, year, issues):
    base = f'{base}/files'
    if year < 2009:
        filename = format_filename_pre_2009(year, issues)
        path = get_storage_path(year, issues)
        yield f'{base}/{filename}', path
    elif year < 2020:
        filename = format_filename_2009_2019(year, issues)
        path = get_storage_path(year, issues, ext='_en.pdf')
        yield f'{base}/{filename}', path
        filename = format_filename_2009_2019(year, issues, is_french=True)
        path = get_storage_path(year, issues, ext='_fr.pdf')
        yield f'{base}/{filename}', path
    else:
        filename = format_filename_post_2019()
        path = get_storage_path(year, issues, ext='_en.pdf')
        yield f'{base}/{filename}', path
        filename = format_filename_post_2019(is_french=True)
        path = get_storage_path(year, issues, ext='_fr.pdf')
        yield f'{base}/{filename}', path


def get_storage_path(year, issues, *, ext='.pdf'):
    if len(issues) == 1:
        return f'{year}/{issues[0]}{ext}'
    else:
        return f'{year}/{issues[0]}-{issues[-1]}{ext}'


def process(data):
    duplicates = set()

    all_issues = []
    for title, base in data:
        print(title)
        for year, issues in parse_title(title):
            assert len(issues) > 0
            assert (year, issues) not in duplicates
            duplicates.add((year, issues))

            print(f'∟ {year}/{issues}')
            all_issues.append((year, issues))

            # for link, file_path in get_links(base, year, issues):
            #     pdf = requests.get(link).content
            #     path = (Path(__file__).parent / '../bulletin/public/issues/' / file_path)
            #     path.parent.mkdir(parents=True, exist_ok=True)
            #     path.write_bytes(pdf)

            #     time.sleep(1.5)

    issues_by_year = defaultdict(list)
    for (year, issues) in all_issues:
        issues_by_year[year].append(issues)

    for year in issues_by_year:
        issues_by_year[year].sort()

    (Path(__file__).parent / '../issues-processed.json').write_text(json.dumps(issues_by_year))


data = json.loads((Path(__file__).parent / '../issues-clean.json').read_text())
process(data)
