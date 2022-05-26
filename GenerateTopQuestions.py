
import math






import sys

from gensim.parsing.preprocessing import remove_stopwords

# query string

query = sys.argv[1]
# print(query)


# def generateTopQuestions(query):
#     # query = "Sum of two numbers Magnus tree Given Number diagram integers array string graph"

# READ MAGNITUDE
Magnitude = []
file_Mag = open('./Magnitude.txt')

doc_Magnitude = file_Mag.read()
# print(doc_Magnitude)
Magnitude = doc_Magnitude.split('\n')
Magnitude.pop()
# print(Magnitude)

titles = []
f1_titles = open('./Problems/Problem_Titles.txt', encoding='utf-8')

doc_titles = f1_titles.read()
titles = doc_titles.split('\n')
# print(doc_titles)
# print(len(titles))

URLs = []
f1_URL = open('./Problems/Problem_URLs.txt', encoding='utf-8')

doc_URL = f1_URL.read()
URLs = doc_URL.split('\n')
# print(doc_titles)
# print(len(URLs))

# READ Keywords
keywords = []
kwds = open('./Keywords.txt', encoding='utf-8')

doc_kwd = kwds.read()
keywords = doc_kwd.split('\n')
# print(keywords)

# READ IDF
IDF = []
idfs = open('./IDF.txt')

doc_idf = idfs.read()
IDF = (doc_idf.split('\n'))
IDF.pop()
# print(len(IDF))

# READ Importance Matrix
Importance_Matrix = []
Imp__Mat = open('./TFIDF.txt', encoding='utf-8')

doc_ImpMat = Imp__Mat.read()
Importance_Matrix = doc_ImpMat.split('\n')
Importance_Matrix.pop()
# print(Importance_Matrix)

# Query Kwd
query_keywords = []

filtered_sentence = remove_stopwords(query)
filtered_sentence = filtered_sentence.lower()

filtered_sentence = sorted(filtered_sentence.split(" "))

# print(len(filtered_sentence))

# // Query TF
query_TF = []

for j in range(len(keywords)):
    cnt = (filtered_sentence.count(keywords[j]))
    if cnt == 0:
        continue
    tf_local = []
    tf_local.append(0)
    tf_local.append(j)
    tf_local.append(cnt/len(filtered_sentence))
    query_TF.append(tf_local)

# print(query_TF)

query_Importance_Matrix = []

for i in range(len(query_TF)):
    Imp_Matrix = []
    Imp_Matrix.append(query_TF[i][0])
    Imp_Matrix.append(query_TF[i][1])
    Imp_Matrix.append(query_TF[i][2] * float(IDF[query_TF[i][1]]))

    query_Importance_Matrix.append(Imp_Matrix)

# print(query_Importance_Matrix)
# print(Importance_Matrix)

for i in range(len(Importance_Matrix)):
    Importance_Matrix[i] = Importance_Matrix[i].split(" ")

# print(Importance_Matrix)

query_Magnitude = [0.0]

for i in range(len(query_Importance_Matrix)):
    query_Magnitude[query_Importance_Matrix[i][0]] += query_Importance_Matrix[i][2] * \
        query_Importance_Matrix[i][2]

for i in (range(len(query_Magnitude))):
    query_Magnitude[i] = math.sqrt(query_Magnitude[i])

# print(query_Magnitude)

# similarity

similarity = []

for i in range(len(Magnitude)):
    sim = []

    sim.append(0.0)
    sim.append(i)
    similarity.append(sim)

for i in range(len(query_Importance_Matrix)):
    toCheckKeyword = query_Importance_Matrix[i][1]
    # print(type(toCheckKeyword))
    for j in range(len(Importance_Matrix)):
        # print(int(Importance_Matrix[j][1]))
        if int(Importance_Matrix[j][1]) == toCheckKeyword:
            similarity[int(Importance_Matrix[j][0])
                       ][0] += query_Importance_Matrix[i][2] * float(Importance_Matrix[j][2])

# print(query_Magnitude)
for i in range(len(Magnitude)):
    if (float(Magnitude[i])*query_Magnitude[0] == 0.000000):
        continue
    similarity[i][0] = similarity[i][0] / \
        (float(Magnitude[i])*query_Magnitude[0])

similarity = sorted(similarity, reverse=True)

# print((similarity[0:5]))
arr = []
for i in (range(len(similarity[0:5]))):
    ques_details = []
    ques_no = similarity[i][1]
    # print(titles[ques_no])
    ques_details.append(titles[ques_no])
    # print(URLs[ques_no])
    ques_details.append(URLs[ques_no])
    f1 = open('Problems/P_'+str(ques_no+1)+'.txt', encoding='utf-8')
    docs = str(f1.read())

    docs = docs.replace("\\n", " ")
    # print(docs[2:100])
    ques_details.append(docs[2:40])
    # print("\n")
    arr.append(ques_details)
print(arr)
