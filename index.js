const express = require("express");
const ejs = require("ejs");
const path = require("path");
const spawn = require("child_process").spawn;

const app = express();

app.set("view engine", "ejs");

app.use(express.json());

app.use(express.static(path.join(__dirname, "/public")));

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  //   res.send("Hello Parth");
  res.render("index");
});

app.get("/search", (req, res) => {
  const query = req.query;

  const question = query.question;

  // Tf IDF algo
  // <%-
  // <script>
  //   $.ajax({
  //     type: "POST",
  //     url: "~/GenerateTopQuestions.py",
  //     data: { param: text },
  //   }).done(function (o) {
  //     // do something
  //     arr = generateTopQuestions(question);
  //   });
  // </script>
  // %>
  // console.log(question);
  const childPython = spawn("python", ["./GenerateTopQuestions.py", question]);
  childPython.stdout.on("data", function (data) {
    // console.log(typeof data);
    // // strArr = data.toString();
    // // console.log(typeof strArr);
    // var arr = [];
    // // arr = data.toString();
    // arr = data;
    // console.log(arr);
    // // arr = data;
    // // console.log(arr);
    // res.json(data.toString());

    var data_str = data.toString();
    var arr = data_str.split("'], ['");

    // console.log(arr.length);
    var l = arr.length;

    arr[0] = arr[0].slice(3);
    // console.log(arr[0]);

    arr[l - 1] = arr[l - 1].slice(0, -5);
    // console.log(arr[l - 1]);

    var str_arr = [];

    for (let i = 0; i < l; i++) {
      let arr_next_split = [];
      arr_next_split = arr[i].split("', '");
      str_arr.push(arr_next_split);
    }
    // console.log(str_arr);
    // arr = []

    // for(let i=0;i<length(data_str)

    res.json(str_arr);
  });
  childPython.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  // List of top 5 questions

  // setTimeout(() => {
  //   const arr = [
  //     {
  //       title: "ABC",
  //       url: "https://google.com",
  //       statement: "The sum of two elements.",
  //     },
  //     {
  //       title: "ABC",
  //       url: "https://google.com",
  //       statement: "The sum of two elements.",
  //     },
  //     {
  //       title: "ABC",
  //       url: "https://google.com",
  //       statement: "The sum of two elements.",
  //     },
  //     {
  //       title: "ABC",
  //       url: "https://google.com",
  //       statement: "The sum of two elements.",
  //     },
  //     {
  //       title: "ABC",
  //       url: "https://google.com",
  //       statement: "The sum of two elements.",
  //     },
  //   ];
  //   res.json(arr);
  // }, 2000);
});

app.listen(3000, () => {
  console.log("I am on PORT no. " + PORT);
});
