const express = require("express");
const ejs = require("ejs");
const path = require("path");

const app = express();

app.set("view engine", "ejs");

app.use(express.json());

app.use(express.static(path.join(__dirname, "/public")));

const PORT = 3000;

app.get("/", (req, res) => {
  //   res.send("Hello Parth");
  res.render("index");
});

app.get("/search", (req, res) => {
  const query = req.query;

  const question = query.question;

  // Tf IDF algo

  // List of top 5 questions

  setTimeout(() => {
    const arr = [
      {
        title: "ABC",
        url: "https://google.com",
        statement: "The sum of two elements.",
      },
      {
        title: "ABC",
        url: "https://google.com",
        statement: "The sum of two elements.",
      },
      {
        title: "ABC",
        url: "https://google.com",
        statement: "The sum of two elements.",
      },
      {
        title: "ABC",
        url: "https://google.com",
        statement: "The sum of two elements.",
      },
      {
        title: "ABC",
        url: "https://google.com",
        statement: "The sum of two elements.",
      },
    ];
    res.json(arr);
  }, 2000);
});

app.listen(3000, () => {
  console.log("I am on PORT no. " + PORT);
});
