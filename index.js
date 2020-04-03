const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const crawl = require("./crawlData");

app.use(cors());

app.get("/getall", (req, res) => {
  let data = JSON.parse(fs.readFileSync("data.json"));
  res.json({
    status: true,
    data: data
  });
});

app.listen(process.env.PORT || 8080, function() {
  console.log("Server up and listening");
});
var CronJob = require("cron").CronJob;
var job = new CronJob(
  "30 * * * *",
  function() {
    crawl();
  },
  null,
  true,
  "America/Los_Angeles"
);
job.start();
