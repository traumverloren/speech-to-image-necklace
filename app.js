process.env.GOOGLE_APPLICATION_CREDENTIALS = "thijs-vision-keys.json";
const keys = require("./keys.js");

// websockets, why not?
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 40510 });

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    console.log("received: %s", message);

    if (message === "startSpeechRecognition") {
      startSpeechRecording();
      ws.send("Started the recording, yo");
    }

    if (message === "stopSpeechRecognition") {
      stopSpeechRecording();
      ws.send("Stopped the recording, yo");
    }
  });
});

// for making external REST api calls for custom search
const request = require("request");
const rp = require("request-promise");

// ----- Express Stuff -----
const express = require("express");
const app = express();
app.use(express.static("client"));

app.listen(3000);

// ----- Google Image Search Stuff -----
let currentImageURL =
  "https://i.kym-cdn.com/entries/icons/mobile/000/018/012/this_is_fine.jpg";

const findImage = () => {
  const searchOptions = {
    uri: "https://www.googleapis.com/customsearch/v1",
    qs: {
      key: keys.SEARCH_API_KEY,
      cx: keys.SEARCH_ID,
      q: currentWord,
      num: 1,
      safe: "active",
      imgSize: "large",
      searchType: "image" // -> uri + '?key=xxxxx%20xxxxx&cx=123&imgSize=large&num=1&safe=active&searchType=image'
    },
    headers: {
      "User-Agent": "Request-Promise"
    },
    json: true // Automatically parses the JSON string in the response
  };

  rp(searchOptions).then(function(results) {
    console.log(currentImageURL);
    if (results && results.items && results.items[0].link) {
      return results.items[0].link;
    }
  });
};

// ----- Speech to text stuff -----
const speech = require("@google-cloud/speech");
const fs = require("fs");

// Creates a speech client
const client = new speech.SpeechClient();
const record = require("node-record-lpcm16");

const encoding = "LINEAR16";
const sampleRateHertz = 16000;
const languageCode = "en-US";

const speechRequest = {
  config: {
    encoding,
    sampleRateHertz,
    languageCode
  },
  interimResults: true // If you want interim results, set this to true
};

const wordsToAvoid = [
  "",
  "can",
  "could",
  "would",
  "will",
  "wants",
  "want",
  "it",
  "he",
  "she",
  "is",
  "was",
  "did",
  "do",
  "does",
  "done",
  "has",
  "have",
  "the",
  "a",
  "an",
  "of",
  "on",
  "at",
  "with",
  "up",
  "down",
  "left",
  "right"
];

let currentWord = "";
let currentInterval;

const processText = data => {
  const sentence =
    data.results[0] && data.results[0].alternatives[0]
      ? data.results[0].alternatives[0].transcript
      : "";
  const words = sentence
    .split(" ")
    .filter(word => !wordsToAvoid.includes(word));
  currentWord = words[Math.floor(Math.random() * words.length)];
  console.log(currentWord);
};

const stopSpeechRecording = () => {
  clearInterval(currentInterval);
  client.streamingRecognize(speechRequest).end();
  record.stop();
  console.log("Stopped stream");
};

const startSpeechRecording = () => {
  // Start recording and send the microphone input to the Speech API
  record
    .start({
      sampleRateHertz,
      threshold: 0,
      verbose: false,
      recordProgram: "rec", // Try also "arecord" or "sox"
      silence: "1000.0"
    })
    .on("error", console.error)
    .pipe(
      // if stop/restart, can't write to an ended stream!
      // must create new stream each time.
      // https://stackoverflow.com/questions/43968494/node-stream-get-write-after-end-error
      client
        .streamingRecognize(speechRequest)
        .on("error", console.error)
        .on("data", processText)
    );
  console.log("Listening, press Ctrl+C to stop.");

  currentInterval = setInterval(findImage, 5000);
};
