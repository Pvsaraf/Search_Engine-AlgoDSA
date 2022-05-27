const express = require("express");
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");
const sw = require("stopword");
const { removeStopwords } = require("stopword");

const app = express();

app.set("view engine", "ejs");

app.use(express.json());

app.use(express.static(path.join(__dirname, "/public")));

const PORT = process.env.PORT || 3000;

// Reading titles
titles = [];
let data = fs.readFileSync("./Problems/Problem_Titles.txt", {
  encoding: "utf-8",
  flag: "r",
});

titles = data.split(/\r?\n/);

// Reading URLs
URLs = [];
data = fs.readFileSync("./Problems/Problem_URLs.txt", {
  encoding: "utf-8",
  flag: "r",
});

URLs = data.split(/\r?\n/);

// Reading Magnitude

Magnitude = [];
data = fs.readFileSync("./Magnitude.txt", {
  encoding: "utf-8",
  flag: "r",
});

Magnitude = data.split(/\r?\n/);
Magnitude.splice(-1);

// Reading Keywords

Keywords = [];
data = fs.readFileSync("./Keywords.txt", {
  encoding: "utf-8",
  flag: "r",
});

Keywords = data.split(/\r?\n/);

// Reading IDF

IDF = [];
data = fs.readFileSync("./IDF.txt", {
  encoding: "utf-8",
  flag: "r",
});

IDF = data.split(/\r?\n/);
IDF.splice(-1);

// Reading TFIDF (Importance Matrix)

Importance_Matrix = [];
data = fs.readFileSync("./TFIDF.txt", {
  encoding: "utf-8",
  flag: "r",
});

Importance_Matrix = data.split(/\r?\n/);
Importance_Matrix.splice(-1);

for (let i = 0; i < Importance_Matrix.length; i++) {
  Importance_Matrix[i] = Importance_Matrix[i].split(" ");
}

app.get("/", (req, res) => {
  //   res.send("Hello Parth");
  res.render("index");
});

app.get("/search", (req, res) => {
  const query = req.query;

  let question = query.question;

  // // Tf IDF algo

  // Query Keywords

  let query_keywords = [];
  question = question.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
  question = question.toLowerCase();
  query_keywords = question.split(" ");
  query_keywords = removeStopwords(query_keywords);
  query_keywords = query_keywords.sort();

  // Query TF
  let query_TF = [];

  for (let i = 0; i < Keywords.length; i++) {
    let cnt = query_keywords.filter((x) => x === Keywords[i]).length;
    if (cnt == 0) continue;
    // console.log(cnt, Keywords[i]);
    tf_local = [];
    tf_local.push(0);
    tf_local.push(i);
    tf_local.push(cnt / query_keywords.length);
    query_TF.push(tf_local);
  }
  // console.log(query_TF);

  // Query Importance Matrix

  let query_importance_matrix = [];

  for (let i = 0; i < query_TF.length; i++) {
    Imp_Mat = [];
    Imp_Mat.push(query_TF[i][0]);
    Imp_Mat.push(query_TF[i][1]);
    Imp_Mat.push(query_TF[i][2] * parseFloat(IDF[query_TF[i][1]]));
    query_importance_matrix.push(Imp_Mat);
  }
  // console.log(query_importance_matrix);

  let query_magnitude = 0.0;

  for (let i = 0; i < query_importance_matrix.length; i++) {
    query_magnitude +=
      query_importance_matrix[i][2] * query_importance_matrix[i][2];
  }

  query_magnitude = Math.sqrt(query_magnitude);
  // console.log(query_magnitude);

  let similarity = [];

  for (let i = 0; i < Magnitude.length; i++) {
    sim = [];
    sim.push(0.0);
    sim.push(i);
    similarity.push(sim);
  }

  for (let i = 0; i < query_importance_matrix.length; i++) {
    let toCheckKwd = query_importance_matrix[i][1];
    for (let j = 0; j < Importance_Matrix.length; j++) {
      if (parseInt(Importance_Matrix[j][1]) == toCheckKwd) {
        similarity[parseInt(Importance_Matrix[j][0])][0] +=
          query_importance_matrix[i][2] * parseFloat(Importance_Matrix[j][2]);
      }
    }
  }

  for (let i = 0; i < Magnitude.length; i++) {
    similarity[i][0] =
      similarity[i][0] / (parseFloat(Magnitude[i]) * query_magnitude);
  }
  // console.log(similarity.sort().reverse());

  arr = [];

  for (let i = 0; i < 5; i++) {
    ques_details = [];
    ques_no = similarity[i][1];
    ques_details.push(titles[ques_no]);
    ques_details.push(URLs[ques_no]);
    // console.log(ques_no.toString());
    fileData = fs.readFileSync(
      "./Problems/P_" + (ques_no + 1).toString() + ".txt",
      { encoding: "utf-8", flag: "r" }
    );
    fileData = fileData.replace(/\\n/g, " ");
    // console.log(fileData.slice(2, -1));
    if (fileData.length > 100) ques_details.push(fileData.slice(2, 100));
    else ques_details.push(fileData.slice(2, -1));
    arr.push(ques_details);
  }

  // List of top 5 questions

  // setTimeout(() => {
  // const arr = [
  //   ["ABC", "https://google.com", "The sum of two elements."],
  //   ["ABC", "https://google.com", "The sum of two elements."],
  //   ["ABC", "https://google.com", "The sum of two elements."],
  //   ["ABC", "https://google.com", "The sum of two elements."],
  //   ["ABC", "https://google.com", "The sum of two elements."],
  // ];

  // }, 2000);
  res.json(arr);
});

app.get("/about", (req, res) => {
  res.send("ABOUT PAGE");
});

app.get("/question/:id", (req, res) => {
  const id = req.params.id;
  // f1 = open("Problems/Problem_Titles.txt");
  // docs = str(f1.read());
  // titles = docs.split("\n");
  res.locals.question = "titles[id - 1];";
  res.render("question");
});

app.listen(PORT, () => {
  console.log("I am on PORT no. " + PORT);
});
