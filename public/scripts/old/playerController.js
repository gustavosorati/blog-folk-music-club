import writeMachine from './writeMachine.js';

export default function playerController() {
  const play = document.querySelector('[data-player="player"]');
  const albumAudio = document.querySelector('.album-audio');
  const agulha = document.querySelector('.agulha');

  let x = document.querySelector('.nav_title h1');

  writeMachine(x);
  function handleClick(event) {
    const disc = document.querySelector('.disc');

    if (this.classList.contains('active')) {
      this.classList.remove('active', 'fa-play');
      this.classList.add('stopped', 'fa-pause');

      disc.classList.add('active');
      agulha.classList.add('active');

      albumAudio.play();
    } else {
      this.classList.remove('stopped', 'fa-pause');
      this.classList.add('active', 'fa-play');

      disc.classList.remove('active');
      agulha.classList.remove('active');

      albumAudio.pause();
    }
  }

  play.addEventListener('click', handleClick);
}
