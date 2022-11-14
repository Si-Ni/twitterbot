require("dotenv").config();
const rwClient = require("./bot");
const CronJob = require("cron").CronJob;
const express = require("express");

const app = express();

// wird benötigt, da Heroku auf die Verbindung mit einem Port wartet
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});

const getInspirationalQuotes = async () => {
  let jsonData;
  await fetch("https://type.fit/api/quotes")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      jsonData = data;
    });
  let result = [];
  for (let quote in jsonData) result.push(jsonData[quote]);
  return result;
};

const tweetInspirationalQuote = async () => {
  let inspirationalQuotes = await getInspirationalQuotes();
  const randomNumber = Math.floor(Math.random() * inspirationalQuotes.length);
  const todaysQuote = inspirationalQuotes[randomNumber];
  const quote = `${todaysQuote.text} - ${todaysQuote.author}`;
  console.log(quote);
  if (quote.length > 280) {
    await tweetInspirationalQuote();
    return;
  }
  await tweet(quote);
};

tweetInspirationalQuote();

const tweet = async (string) => {
  try {
    await rwClient.v2.tweet(string);
  } catch (e) {
    console.error(e);
  }
};

let job = new CronJob(
  "0 0 6 * * *",
  tweetInspirationalQuote,
  null,
  true,
  "UTC+1"
);

const getRandomJoke = async () => {
  let result;
  const url = `https://api.humorapi.com/jokes/random?api-key=${process.env.HUMORAPI}`;
  await fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      result = data;
    });
  console.log(result);
  if (!result.joke) {
    console.log("error: " + result.message);
    return false;
  } else if (result.joke.length > 280) {
    await getRandomJoke();
    return;
  } else {
    return result.joke;
  }
};

const tweetJoke = async () => {
  let joke = await getRandomJoke();
  if (joke) {
    await tweet(joke);
  }
};

let job2 = new CronJob("0 0 12 * * *", tweetJoke, null, true, "UTC+1");

let job3 = new CronJob("0 0 18 * * *", tweetJoke, null, true, "UTC+1");
