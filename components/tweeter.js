// require .env packacge
require("dotenv").config();

// require twitter package
var TwitterPackage = require("twitter");

// require underscore-node
var _ = require('underscore-node');

// twitter api keys
var secret = {
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
};

// make a new twitter object that takes in the api keys
var Twitter = new TwitterPackage(secret);

var randomCount = _.random(1, 100)
var randomPage = _.random(1, 62) // 62 is the max number of pages of 100 names/content available via the API

// get request to yoruba names api
function retrieveTweet () {
  // const http = require("http");
  var https = require('https');
  const url =
    `https://www.yorubaname.com/v1/names?page=${randomPage}&count=${randomCount}&state=PUBLISHED`;
  https.get(url, res => {
    res.setEncoding("utf8");
    let body = "";
    res.on("data", data => {
      body += data;
    });
    res.on("end", () => {
      body = JSON.parse(body);

      // pick a random name from JSON repsonse without repeating
      var randomName = _.sample(body);
      console.log(randomName);
      // create link for random name
      var linkBack = `http://www.yorubaname.com/entries/${randomName["name"]}`;
      console.log(randomName["name"]+ "\n" + randomName["meaning"] + "\n" + linkBack);

      // posting to twitter
      Twitter.post("statuses/update", {status:randomName["name"]+ "\n" + randomName["meaning"] + "\n" + linkBack},  function(error, tweet, response){
        if(error) console.log( '[tweeter][error] failed to post tweet', error, tweet, response );
        else console.log( '[tweeter] tweeted new yoruba name', tweet, response );
      });
    });
  })
};

const init = () => retrieveTweet();

// Expose the `init` function, so it can be administered by the clock/cron module.
module.exports = init;
