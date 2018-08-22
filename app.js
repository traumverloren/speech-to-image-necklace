const express = require("express");
const app = express();

app.set("view engine", "ejs");

app.get("/", function(req, res) {
  res.render("index");
});

app.use(express.static("public"));

app.listen(3000);

app.get("/image", function(req, res) {
  let data = "hiiiiii" + Math.floor(Math.random() * 100);
  res.send({ data });
});
