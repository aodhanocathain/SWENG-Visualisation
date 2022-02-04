const express = require("express")
const fs = require("fs");
const port = 3000;

const app = express()

app.get('/', (_req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  fs.readFile("./index.html", function (error, data) {
    if (error) {
      res.writeHead(404);
      res.write("not found");
    } else {
        res.write(data)
    }
    res.end()
  });
});

app.get('/visualise', (_req, res) => {
  console.log(_req.url)
  res.writeHead(200, { "Content-Type": "text/html" });
  fs.readFile("./index.html", function (error, data) {
    if (error) {
      res.writeHead(404);
      res.write("not found");
    } else {
        res.write(data)
    }
    res.end()
  });
});

app.listen(port, (error) => {
  if (error) {
    console.log("something went wrong: ", error);
  } else {
    console.log("listening on port ", port);
  }
});