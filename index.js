const rwClient = require("./bot");
const CronJob = require("cron").CronJob;

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

let inspirationalQuotes;
let dayCounter = 0;

const setInspirationalQuotes = async () => {
  inspirationalQuotes = await getInspirationalQuotes();
};

setInspirationalQuotes();

const tweetInspirationalQuote = async () => {
  const todaysQuote = inspirationalQuotes[dayCounter];
  const quote = `${todaysQuote.text} - ${todaysQuote.author}`;
  console.log(dayCounter);
  console.log(quote);
  dayCounter++;
  if (quote.length > 280) {
    await tweetInspirationalQuote();
    return;
  }
  await tweet(quote);
};

const tweet = async (string) => {
  try {
    await rwClient.v2.tweet(string);
  } catch (e) {
    console.error(e);
  }
};

tweet("test");

let job = new CronJob(
  "0 56 10 * * *",
  tweetInspirationalQuote,
  null,
  true,
  "UTC+1"
);
