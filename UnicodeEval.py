from email import charset
import encodings
from pydoc import doc
import string
import unicodedata
from numpy import char
import unidecode
import re

# //This file converts it into Ascii format (unicode characters are removed)

for i in range(1, 966):
    f1 = open("./Problems/P_" + str(i) + ".txt", encoding="utf-8")
    docs = str(f1.read())
    
    for ch1 in range(10):
        for ch2 in range(10):
            docs = docs.replace(("\\x" + str(ch1) + str(ch2)), " ")

    for ch1 in range(10):
        for ch2 in range(6):
            ch = string.ascii_lowercase[ch2]
            docs = docs.replace(("\\x" + str(ch1) + ch), " ")

    for ch1 in range(10):
        for ch2 in range(6):
            ch = string.ascii_lowercase[ch2]
            docs = docs.replace(("\\x" + ch + str(ch1)), " ")

    for ch1 in range(6):
        for ch2 in range(6):
            ch = string.ascii_lowercase[ch2]
            docs = docs.replace(("\\x" + ch + string.ascii_lowercase[ch1]), " ")

    f1 = open("./Problems/P_" + str(i) + ".txt", "w+")
    f1.write(docs)

    # print(docs.find("\\xa0"))
    # print(docs[1:].replace("\xa0", " "))

    # print(''.join([i if ord(i) < 128 else ' ' for i in docs]))
