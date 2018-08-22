document.addEventListener("DOMContentLoaded", function(event) {
  const speechToggle = document.getElementById("myonoffswitch");
  const currentImage = document.getElementById("current-image");
  speechToggle.addEventListener("change", () => {
    if (this.checked) {
      console.log("Speech Recognition ON");
    } else {
      console.log("zzZzZZZz");
    }
  });

  setInterval(() => {
    fetch("/image")
      .then(function(response) {
        return response.json();
      })
      .then(function(response) {
        let data = response.data;
        currentImage.innerHTML = data;
      });
  }, 3000);
});
