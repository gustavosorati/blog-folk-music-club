export default function initAudio() {
  const albumAudio = document.querySelector('.album-audio');
  window.onload = function () {
    albumAudio.play();
  };
}
