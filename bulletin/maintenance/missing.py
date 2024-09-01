import json
from collections import defaultdict
from pathlib import Path


with Path.open(Path(__file__).parent / "issues-processed.json") as f:
    issues_processed = json.load(f)

missing = defaultdict(set)
for year, data in issues_processed.items():
    for lang, issues in data.items():
        for issue in issues:
            if not issue["exists"]:
                for i in issue["issue"]:
                    missing[year].add(f"({lang}) {i}")

for year in missing:
    print(year)
    for issue in sorted(missing[year]):
        print(f"∟ {issue}")
