const express = require("express");
const fetch = require('node-fetch');
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

app.get("/visualise", async (_req, res) => {

  const segments = _req.url.split("%2F")  //taken from the user's pasted link
  const url = `https://api.github.com/repos/${segments[3]}/${segments[4]}/stats/contributors`
  const response = await dataGet(url)

  const commitCounts = {}

  response.forEach(function (item, index, arr) {
    commitCounts[`'${item['author']['login']}'`] = item['total']
  })

  //scuffed reconstruction of a new page
  let htmlstring = "" + fs.readFileSync("./chartpt1.txt")
  htmlstring = htmlstring + `const names = [${Object.keys(commitCounts)}];\n`
  htmlstring = htmlstring + `const values = [${Object.values(commitCounts)}];\n`
  htmlstring = htmlstring + fs.readFileSync("./chartpt2.txt")

  fs.writeFileSync("response.txt", htmlstring)  //debugging purposes

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

async function dataGet(url) {
  const response = await fetch(url);
  const result = await response.json();
  return result;
}
