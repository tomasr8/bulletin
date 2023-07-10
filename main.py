from pypdf import PdfReader

import matplotlib.pyplot as plt
from wordcloud import WordCloud


reader = PdfReader("01-1965.pdf")
number_of_pages = len(reader.pages)
page = reader.pages[1]

text = ""
for page in reader.pages:
    text += "\n" + page.extract_text()
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