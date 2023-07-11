from pathlib import Path


def parse_segment(segment):
    issue, year = segment.rsplit("-", maxsplit=1)
    year = int(year)
    if '-' in issue:
        first, last = issue.split("-")
        issues = list(range(int(first), int(last) + 1))
    else:
        issues = [int(issue)]
    return year, issues


def format_segment(year, issues, ext=True):
    if len(issues) == 1:
        segment = f"{issues[0]}"
    else:
        segment = f"{issues[0]}-{issues[-1]}"
    return segment if not ext else f"{segment}.pdf"


for pdf in (Path(__file__).parent / "../bulletin/public/issues").rglob("*"):
    if not pdf.is_file():
        continue

    year, issue = parse_segment(pdf.stem)
    print(pdf.parent / format_segment(year, issue))
    pdf.rename(pdf.parent / format_segment(year, issue))
