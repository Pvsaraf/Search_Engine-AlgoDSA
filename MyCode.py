from itertools import count
from lib2to3.pgen2 import driver
import time 

from selenium import webdriver
from bs4 import BeautifulSoup as soup
from webdriver_manager.chrome import ChromeDriverManager

driver = webdriver.Chrome(ChromeDriverManager().install())

startingWebsite = "https://leetcode.com/problemset/all/";

count = 0
urls = []
Titles = []
for page_no in range(1, 25):
    # print(startingWebsite+"?page="+str(page_no))

    driver.get(startingWebsite+"?page="+str(page_no))

    time.sleep(5)

    page_html = driver.page_source

    page_soup = soup(page_html, 'html.parser')

    # print(page_soup)

    # print(len((page_soup.find_all("div", {"class":"odd:bg-layer-1 even:bg-overlay-1 dark:odd:bg-dark-layer-bg dark:even:bg-dark-fill-4"}))))
    prob = (page_soup.find_all("div", {"class":"odd:bg-layer-1 even:bg-overlay-1 dark:odd:bg-dark-layer-bg dark:even:bg-dark-fill-4"}))
    (page_soup.find_all("div", {"class":"odd:bg-layer-1 even:bg-overlay-1 dark:odd:bg-dark-layer-bg dark:even:bg-dark-fill-4"}))

    pos = 0
    if page_no == 1:
        pos=1
    for i in range(pos, len(prob)):
        
        problem_div = (prob[i].find_all("div", {"class":"mx-2 py-[11px]"}))[1].div.div.div
        problem_title = (problem_div.div.a.text)
        pos = problem_title.find('.')
        # print(pos)
        problem_title = problem_title[pos+2:]
        # print((problem_title))
        # f1.write()
        if len(problem_div.find_all("svg", {"class" : "ml-2 shrink-0"})) != 0:
            continue;
        
       
        
        problem_url = "https://leetcode.com" + str(((prob[i].find_all("div", {"class":"mx-2 py-[11px]"}))[1].div.div.div.div.a["href"]))

        
        # driver = webdriver.Chrome(ChromeDriverManager().install())
        # print(problem_url)
        driver.get(problem_url)
        time.sleep(5)

        page_html = driver.page_source

        page_soup = soup(page_html, 'html.parser')

        # print(((page_soup.find_all("div", {"class": "content__u3I1 question-content__JfgR"})))[0])
        

        Given_id = (page_soup.find_all("div", {"class": "content__u3I1 question-content__JfgR"}))
        if len(Given_id) == 0:
            continue

        count += 1
        print(problem_url)
        print(count)
        urls.append(problem_url)
        Titles.append(problem_title)
        problem_text = (str(Given_id[0].div.get_text().encode('utf-8')))
        with open("Problems/" +"P_" + str(count) + ".txt", "w+") as f:
            f.write(problem_text)

f1 = open("./Problems/Problem_URLs.txt", 'w+')
f1.write('\n'.join(urls)) 
f2 = open("./Problems/Problem_Titles.txt", 'w+')
f2.write('\n'.join(Titles)) 


