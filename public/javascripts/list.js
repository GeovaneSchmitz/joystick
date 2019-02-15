var socket = io();
socket.on('controllers', function (data) {
  for (var key in data) {
    if (data[key]) {
      document.querySelector("[data-controller='" + key + "']").classList.remove("disable");
    } else {
      document.querySelector("[data-controller='" + key + "']").classList.add("disable");

    }
  }
});
window.onload = function () {
  function OnClickNumber(element) {
    document.querySelectorAll("[data-controller].selected").forEach(function (element) {
      element.classList.remove("selected")
    });
    this.classList.add("selected");
  }
  function OnClickPlay(element) {
    var selected = document.querySelector("[data-controller].selected").getAttribute("data-controller")
    socket.emit("select", selected);

  }
  document.getElementById('button-play').addEventListener("click", OnClickPlay)
  document.querySelectorAll("[data-controller]").forEach(function (element) {
    element.addEventListener("click", OnClickNumber)

  });
}