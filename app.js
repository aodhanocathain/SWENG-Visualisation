const express = require("express");
const fetch = require("node-fetch");
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

function commitScore(commit) {
  /*
  let score = 0;
  commit["files"].forEach(function (item, index, arr) {
    score = score + item["patch"].length;
  });
  */
  console.log(commit);
  return 1;
}

app.get("/visualise", async (_req, res) => {
  const segments = _req.url.split("%2F"); //taken from the user's pasted link
  let url = `https://api.github.com/repos/${segments[3]}/${segments[4]}/stats/contributors`;
  let response = await dataGet(url);

  const scores = {};

  response.forEach(async function (contributor, index, contributors) {
    const firstWeek = 0;  let lastWeek = 0;
    let totalCommits = 0
    contributor["weeks"].forEach(function (week, i, weeks) {
      if (week["c"] > 0) {
        totalCommits = totalCommits + week['c']
        lastWeek = i;
      } //active this week
    });
    const avgWeeklyCommits =  totalCommits/(1+(lastWeek-firstWeek))

    let score = 0
    //for each week where the contributor had work left to do
    for(let i=0; i<=lastWeek; i++)
    {
      //figure out how different this week's commit count is from the average
      const week = contributor['weeks'][i]
      const commits = week['c']
      const factor = 1/(1+(Math.abs(commits-avgWeeklyCommits)/avgWeeklyCommits))
      //use this to weight that week's additions and deletions
      score += (week['a'] + week['d']) * factor
    }
    scores[`'${contributor['author']['login']}'`] = score
  });

  //scuffed reconstruction of a new page
  let htmlstring = "" + fs.readFileSync("./chartpt1.txt");
  htmlstring = htmlstring + `const names = [${Object.keys(scores)}];\n`;
  htmlstring = htmlstring + `const values = [${Object.values(scores)}];\n`;
  htmlstring = htmlstring + fs.readFileSync("./chartpt2.txt");

  fs.writeFileSync("response.txt", htmlstring); //debugging purposes

  res.writeHead(200, { "Content-Type": "text/html" });
  res.write(htmlstring);
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
