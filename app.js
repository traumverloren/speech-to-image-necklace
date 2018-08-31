process.env.GOOGLE_APPLICATION_CREDENTIALS = "thijs-vision-keys.json";
const keys = require("./keys.js");
const wordsToAvoid = require("./wordsToAvoid.js");
const validImageFormats = [".jpg", ".jpeg", ".png", ".gif"];
let currentImageURL;

// for making external REST api calls for custom search
const request = require("request");
const rp = require("request-promise");

// ----- Express Stuff -----
const express = require("express");
const app = express();
app.use(express.static("client"));

app.listen(3000);

// websockets, cuz why not?
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 40510 });

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    console.log("received: %s", message);

    if (message === "startSpeechRecognition") {
      currentImageURL = "https://i.ytimg.com/vi/p1RS97kQpKY/maxresdefault.jpg";
      ws.send(currentImageURL);

      // start speech api
      startSpeechRecording();

      // update image every 2 seconds
      currentInterval = setInterval(() => {
        // if current word hasn't changed, don't send another request to image search api
        if (currentWord != nextWord) {
          currentWord = nextWord;
          findImage(currentWord);
        }
        try {
          if (ws.readyState != WebSocket.CLOSED) {
            // send image url to client
            ws.send(currentImageURL);
          }
        } catch (e) {
          console.log(e);
        }

        console.log(currentImageURL);
      }, 2000);
    }

    if (message === "stopSpeechRecognition") {
      stopSpeechRecording();
      currentImageURL =
        "https://st2.depositphotos.com/2495409/12280/i/950/depositphotos_122801838-stock-photo-start-button-concept-illustration.jpg";

      try {
        if (ws.readyState != WebSocket.CLOSED) {
          ws.send(currentImageURL);
        }
      } catch (e) {
        console.log(e);
      }
      clearInterval(currentInterval);
    }
  });
});

// ----- Google Image Search Stuff -----
const findImage = query => {
  // format request and send to custom search API
  // limited to 10,000/day (FYI that's ~1 every 7 sec over 24hr period)
  const searchOptions = {
    uri: "https://www.googleapis.com/customsearch/v1",
    qs: {
      key: keys.SEARCH_API_KEY,
      cx: keys.SEARCH_ID,
      q: query,
      num: 10,
      safe: "active",
      searchType: "image" // -> uri + '?key=xxxxx%20xxxxx&cx=123&imgSize=large&num=1&safe=active&searchType=image'
    },
    headers: {
      "User-Agent": "Request-Promise"
    },
    json: true // Automatically parses the JSON string in the response
  };

  rp(searchOptions).then(function(results) {
    if (results && results.items) {
      // Check all 10 link items if jpeg, jpg, png, gif.
      const imageURLs = results.items
        .map(item => item.link)
        .filter(url => validImageFormats.some(format => url.includes(format)));
      console.log(imageURLs.length);
      // Set currentImageURL randomly from that filtered array
      currentImageURL = imageURLs[Math.floor(Math.random() * imageURLs.length)];
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

let currentWord = "";
let nextWord = "";
let currentInterval;

const processText = data => {
  // set speech api response as sentence
  const sentence =
    data.results[0] && data.results[0].alternatives[0]
      ? data.results[0].alternatives[0].transcript
      : "";

  // convert sentence to array of words & filter out wordsToAvoid
  const words = sentence
    .split(" ")
    .filter(word => !wordsToAvoid.includes(word.toLowerCase()));

  // Set nextWord as last word in array
  nextWord = words.length > 0 ? words[words.length - 1] : "say something";
};

const stopSpeechRecording = () => {
  // Stop recording and don't send to the Speech API
  client.streamingRecognize(speechRequest).end();
  record.stop();
  console.log("Stopped recording");
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
};
