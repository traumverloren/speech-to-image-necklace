document.addEventListener("DOMContentLoaded", function(event) {
  const touchscreen = document.querySelector("main");
  const currentImage = document.getElementById("current-image");
  let speechActivated = false;
  let currentInterval;

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
    // stopSpeechRecognition();
    stopUpdateImage();
  };

  const stopSpeechRecognition = () => {
    currentImage.innerHTML = "STOPPED!";
    touchscreen.classList.add("-redBorder");
    touchscreen.classList.remove("-greenBorder");

    fetch("/speak", {
      method: "POST"
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(response) {
        let data = response.data;
        console.log(data);
      });
  };
  const startSpeechRecognition = () => {
    touchscreen.classList.add("-greenBorder");
    touchscreen.classList.remove("-redBorder");

    currentImage.innerHTML = "STARTED";

    fetch("/speak")
      .then(function(response) {
        return response.json();
      })
      .then(function(response) {
        let data = response.data;
        console.log(data);
      });
  };

  const startUpdateImage = () => {
    currentInterval = setInterval(fetchImage, 3000);
  };

  const stopUpdateImage = () => {
    clearInterval(currentInterval);
  };

  const fetchImage = () => {
    fetch("/image")
      .then(function(response) {
        return response.json();
      })
      .then(function(response) {
        let data = response.data;
        currentImage.innerHTML = data;
      });
  };
});
