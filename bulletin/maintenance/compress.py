import sys
from pathlib import Path
from subprocess import check_call


if __name__ == "__main__":
    issues = Path(sys.argv[1])
    compressed = issues.parent / "issues_compressed"

    for year in issues.glob("*"):
        (compressed / year.name).mkdir(exist_ok=True, parents=True)

    pdfs = issues.rglob("*.pdf")
    for pdf in pdfs:
        print(pdf)
        out = compressed / pdf.parts[-2] / pdf.name
        check_call(
            [  # noqa: S603, S607
                "gs",
                "-sDEVICE=pdfwrite",
                "-dCompatibilityLevel=1.4",
                "-dPDFSETTINGS=/default",
                "-dNOPAUSE",
                "-dBATCH",
                "-dQUIET",
                "-dDetectDuplicateImages",
                "-dCompressFonts=true",
                f"-sOutputFile={out}",
                f"{pdf}",
            ]
        )
