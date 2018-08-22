document.addEventListener("DOMContentLoaded", function(event) {
  var speechToggle = document.getElementById("myonoffswitch");

  speechToggle.addEventListener("change", function() {
    if (this.checked) {
      console.log("Speech Recognition ON");
    } else {
      console.log("zzZzZZZz");
    }
  });
});
