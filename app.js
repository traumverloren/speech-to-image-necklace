process.env.GOOGLE_APPLICATION_CREDENTIALS = "thijs-vision-keys.json";

const express = require("express");
const app = express();

app.use(express.static("client"));

app.listen(3000);

app.get("/image", function(req, res) {
  let data = "hiiiiii" + Math.floor(Math.random() * 100);
  res.send({ data });
});

app.get("/speak", function(req, res) {
  startSpeechRecording();
  res.send({ data: "Started the recording, yo" });
});

app.post("/speak", function(req, res) {
  stopSpeechRecording();
  res.send({ data: "Stopped the recording, yo" });
});

// Imports the Google Cloud client library
const speech = require("@google-cloud/speech");
const fs = require("fs");

// Creates a speech client
const client = new speech.SpeechClient();
const record = require("node-record-lpcm16");

const encoding = "LINEAR16";
const sampleRateHertz = 16000;
const languageCode = "en-US";

const request = {
  config: {
    encoding,
    sampleRateHertz,
    languageCode
  },
  interimResults: true // If you want interim results, set this to true
};

// Create a recognize stream
const recognizeStream = client
  .streamingRecognize(request)
  .on("error", console.error)
  .on("data", data =>
    process.stdout.write(
      data.results[0] && data.results[0].alternatives[0]
        ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
        : `\n\nReached transcription time limit, press Ctrl+C\n`
    )
  );

const stopSpeechRecording = () => {
  record.stop();
};

const startSpeechRecording = () => {
  // Start recording and send the microphone input to the Speech API
  record
    .start({
      sampleRateHertz,
      threshold: 0,
      verbose: true,
      recordProgram: "rec", // Try also "arecord" or "sox"
      silence: "1000.0"
    })
    .on("error", console.error)
    .pipe(recognizeStream);

  console.log("Listening, press Ctrl+C to stop.");
};
