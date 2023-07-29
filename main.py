from pathlib import Path
import json
from string import ascii_lowercase

from pypdf import PdfReader

import matplotlib.pyplot as plt
from wordcloud import WordCloud


fr_stopwords = json.loads(Path('fr.json').read_text(encoding='utf-8')) + [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'jullet', 'aout', 'août', 'septembre',
    'octobre', 'novembre', 'décembre',
    'restaurant', 'cern', 'cern.', 'club', 'membre', 'lecture', 'mois', 'personnel'
    'tél', 'tel', 'tél.', 'tel.', 'semaine', 'fr', 'date', 'lieu', 'prix', 'genève', 'meyrin', 'programme'
]

en_stopwords = json.loads(Path('fr.json').read_text(encoding='utf-8')) + [
    'january', 'february', 'march', 'april', 'may', 'june', 'jully', 'august', 'september',
    'october', 'november', 'december',
    'place', 'weekly', 'bulletin', 'article',
    'week', '-', 'will', 'staff', 'association', 'mr'
]

stopwords = fr_stopwords + en_stopwords + list(ascii_lowercase)

text = ""
for pdf in Path("bulletin/client/public/issues/1980").glob('*'):
    reader = PdfReader(str(pdf))
    page = reader.pages[1]

    for page in reader.pages:
        text += " " + page.extract_text()

text = text.replace("\n", "")
text = ' '.join([word for word in text.split(" ") if word.lower() not in stopwords])
text = ' '.join([word for word in text.split(" ") if word])

Path("out.txt").write_text(text)

print(text.split(" "))

# text = page.extract_text()
# print(text)

# Generate a word cloud image
# wordcloud = WordCloud(max_font_size=40).generate(text)
# plt.imsave("cloud.png", wordcloud)


wordcloud = WordCloud(max_font_size=40).generate(text)
plt.figure()
plt.imshow(wordcloud, interpolation="bilinear")
plt.axis("off")
plt.show()

# Display the generated image:
# the matplotlib way:
# plt.imshow(wordcloud, interpolation='bilinear')
# plt.axis("off")

# # lower max_font_size
# wordcloud = WordCloud(max_font_size=40).generate(text)
# plt.figure()
# plt.imshow(wordcloud, interpolation="bilinear")
# plt.axis("off")
# plt.show()

# The pil way (if you don't have matplotlib)
# image = wordcloud.to_image()
# image.show()