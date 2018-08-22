document.addEventListener("DOMContentLoaded", function(event) {
  const speechToggle = document.getElementById("myonoffswitch");
  const currentImage = document.getElementById("current-image");
  let currentInterval;

  speechToggle.addEventListener("change", () => {
    if (speechToggle.checked) {
      console.log("Speech Recognition ON");
      startSpeechRecognition();
      // updateImage();
    } else {
      console.log("zzZzZZZz");
      stopUpdateImage();
    }
  });

  const stopUpdateImage = () => {
    clearInterval(currentInterval);
  };

  const updateImage = () => {
    currentInterval = setInterval(fetchImage, 3000);
  };

  const startSpeechRecognition = () => {
    fetch("/speak")
      .then(function(response) {
        return response.json();
      })
      .then(function(response) {
        let data = response.data;
        currentImage.innerHTML = data;
      });
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
