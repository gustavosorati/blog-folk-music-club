export default function Music() {
  let currentAudio = audios;
  const play = document.querySelector('[data-player="player"]');
  const albumAudio = document.querySelector('.album-audio');

  console.log(currentAudio);

  albumAudio.audio.src = path(currentAudio[1].src);
}
