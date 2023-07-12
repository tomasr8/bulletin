from pathlib import Path

from pypdf import PdfReader


pdfs = list((Path(__file__).parent / '../bulletin/public/issues').rglob('*'))

for pdf in sorted(pdfs):
    if not pdf.is_file():
        continue

    try:
        PdfReader(pdf)
    except Exception:
        print(f'-> {pdf}')
