document.addEventListener("DOMContentLoaded", function(event) {
  const touchscreen = document.querySelector("main");
  const currentImage = document.getElementById("current-image");
  let speechActivated = false;
  let currentInterval;

  const ws = new WebSocket("ws://localhost:40510");
  // event emmited when connected
  ws.onopen = function() {
    console.log("websocket is connected ...");
    // sending a send event to websocket server
    ws.send("client is connected");
  };
  // event emmited when receiving message
  ws.onmessage = function(ev) {
    console.log(ev);
  };

  touchscreen.addEventListener("click", () => {
    {
      !speechActivated ? activateSpeech() : deactivateSpeech();
    }
    speechActivated = !speechActivated;
  });
  const activateSpeech = () => {
    console.log("Speech Recognition ON");
    startSpeechRecognition();
    startUpdateImage();
  };

  const deactivateSpeech = () => {
    console.log("zzZzZZZz");
    stopSpeechRecognition();
    stopUpdateImage();
  };

  const stopSpeechRecognition = () => {
    currentImage.innerHTML = "STOPPED!";
    touchscreen.classList.add("-redBorder");
    touchscreen.classList.remove("-greenBorder");
    ws.send("stopSpeechRecognition");
  };

  const startSpeechRecognition = () => {
    touchscreen.classList.add("-greenBorder");
    touchscreen.classList.remove("-redBorder");

    currentImage.innerHTML = "STARTED";
    ws.send("startSpeechRecognition");
  };

  const startUpdateImage = () => {
    // currentInterval = setInterval(fetchImage, 3000);
  };

  const stopUpdateImage = () => {
    clearInterval(currentInterval);
  };
});
