const express = require("express");
const fs = require("fs");
const port = 3000;
const app = express();

app.get("/", (_req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  fs.readFile("./index.html", function (error, data) {
    if (error) {
      res.writeHead(404);
      res.write("not found");
    } else {
      res.write(data);
    }
    res.end();
  });
});

const stars = []
const names = []
app.get("/visualise", (_req, res) => {

  const str = '' + fs.readFileSync("defaultdata.json")
  JSON.parse(str)["items"].forEach(function (item, index, arr) {
    names.push(`'${item["name"]}'`);
    stars.push(item["stargazers_count"]);
  })

  let htmlstring = "" + fs.readFileSync("./chartpt1.txt")
  htmlstring = htmlstring + `let names = [${names}];\n`
  htmlstring = htmlstring + `let values = [${stars}];\n`
  htmlstring = htmlstring + fs.readFileSync("./chartpt2.txt")
  fs.writeFileSync("response.txt", htmlstring)

  res.writeHead(200, { "Content-Type": "text/html" });
  res.write(htmlstring)
  res.end();
});

app.listen(port, (error) => {
  if (error) {
    console.log("something went wrong: ", error);
  } else {
    console.log("listening on port ", port);
  }
});