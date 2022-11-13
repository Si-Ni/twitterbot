require("dotenv").config();
const TwitterApi = require("twitter-api-v2").default;

const twitterClient = new TwitterApi({
  appKey: process.env.KEY,
  appSecret: process.env.APPSECRET,
  accessToken: process.env.ACCESSTOKEN,
  accessSecret: process.env.ACCESSSECRET,
});

const rwClient = twitterClient.readWrite;

module.exports = rwClient;
