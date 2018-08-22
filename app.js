const express = require("express");
const app = express();

app.use(express.static("client"));

app.listen(3000);

app.get("/image", function(req, res) {
  let data = "hiiiiii" + Math.floor(Math.random() * 100);
  res.send({ data });
});
