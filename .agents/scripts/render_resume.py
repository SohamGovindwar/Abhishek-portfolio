import fitz
from pathlib import Path
src = Path('attached_assets/Abhishek_Govindwar_Resume_Color_1790678090758.pdf')
out = Path('.agents/outputs/resume-pages')
out.mkdir(parents=True, exist_ok=True)
doc = fitz.open(src)
for index, page in enumerate(doc):
    pix = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
    path = out / f'page-{index+1}.png'
    pix.save(path)
    print(path)
