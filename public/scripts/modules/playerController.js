export default function playerController() {
  const tBody = document.querySelector('tbody');
  const audioFile = audios;

  const playPause = document.querySelector('[data-media="playPause"]');
  const btnNext = document.querySelector('[data-media="next"]');
  const btnPrevius = document.querySelector('[data-media="previus"]');

  const progressBar = document.querySelector('.progress');

  let audioData = audios;
  let audio = new Audio();
  let audioDuration = 0;
  let audioCurrentTime = 0;
  let isPlaying = false;
  let currentAudio = 0;


  function createTable() {
    audioFile.forEach((au, index) => {
      let tr = document.createElement('tr');
      tr.setAttribute('id', `${index}`);

      let keys = Object.keys(au);

      keys.forEach((key) => {
        let td = document.createElement('td');

        if (key === 'id' || key === 'src') {
          // não faz nada nesses dois contextos
        } else if (key === 'cover') {
          let img = document.createElement('img');
          img.setAttribute('src', au[key]);
          td.appendChild(img);
          tr.appendChild(td);
        } else {
          td.innerText = au[key];
          tr.appendChild(td);
        }
      });
      tr.addEventListener('click', changeMusic);
      tBody.appendChild(tr);
    });
  }

  async function changeMusic(event) {
    playPause.querySelector('i').classList.remove('fa-play');
    playPause.querySelector('i').classList.add('fa-stop');
    let musicId = this.getAttribute('id');

    currentAudio = musicId;

    createAudio();
    await audio.play();
    updateStates();
    isPlaying = true;
    progressBar.max = audioDuration;
  }

  function createAudio() {
    audio.src = audioData[currentAudio].src;
  }

  async function resume(src) {
    if (!isPlaying && audio.src == '') {
      isPlaying = true;
      createAudio();
      await audio.play();
      updateStates();
      progressBar.max = audioDuration;
      playPause.querySelector('i').classList.remove('fa-play');
      playPause.querySelector('i').classList.add('fa-stop');
    } else if (!isPlaying) {
      isPlaying = true;
      await audio.play();
      playPause.querySelector('i').classList.remove('fa-play');
      playPause.querySelector('i').classList.add('fa-stop');
    } else {
      isPlaying = false;
      audio.pause();
      playPause.querySelector('i').classList.remove('fa-stop');
      playPause.querySelector('i').classList.add('fa-play');
    }
  }

  async function next() {
    playPause.querySelector('i').classList.remove('fa-play');
    playPause.querySelector('i').classList.add('fa-stop');
    isPlaying = true;
    if (currentAudio < audioData.length - 1) {
      currentAudio++;
      createAudio();
      await audio.play();
      updateStates();
      progressBar.max = audioDuration;
    } else {
      currentAudio = 0;
      createAudio();
      await audio.play();
      updateStates();
      progressBar.max = audioDuration;
    }
  }

  async function previus() {
    playPause.querySelector('i').classList.remove('fa-play');
    playPause.querySelector('i').classList.add('fa-stop');
    isPlaying = true;
    if (currentAudio === 0) {
      currentAudio = audioData.length - 1;
      createAudio();
      await audio.play();
      updateStates();
      progressBar.max = audioDuration;
    } else {
      currentAudio--;
      createAudio();
      await audio.play();
      updateStates();
      progressBar.max = audioDuration;
    }
  }

  function updateStates() {
    const { duration } = audio;

    audioDuration = duration;
  }

  createTable();

  playPause.addEventListener('click', resume);
  btnNext.addEventListener('click', next);
  btnPrevius.addEventListener('click', previus);

  audio.addEventListener('timeupdate', () => {
    progressBar.value = audio.currentTime;

    let aux =
      (progressBar.value - progressBar.getAttribute('min')) /
        progressBar.getAttribute('max') -
      progressBar.getAttribute('min');

    progressBar.style.backgroundImage =
      '-webkit-gradient(linear, left top, right top, ' +
      'color-stop(' +
      aux +
      ', lightgreen), ' +
      'color-stop(' +
      aux +
      ', #C5C5C5)' +
      ')';
  });

  audio.addEventListener('ended', async () => {
    if (currentAudio < audioData.length - 1) {
      currentAudio++;
      createAudio();
      await audio.play();
      updateStates();
      progressBar.max = audioDuration;
    } else {
      currentAudio--;
      createAudio();
      await audio.play();
      updateStates();
      progressBar.max = audioDuration;
    }
  });

  progressBar.addEventListener('change', () => {
    audio.currentTime = progressBar.value;
    if (progressBar.max === '') {
      let aux =
        (progressBar.value - progressBar.getAttribute('min')) / 100 -
        progressBar.getAttribute('min');

      progressBar.style.backgroundImage =
        '-webkit-gradient(linear, left top, right top, ' +
        'color-stop(' +
        aux +
        ', lightgreen), ' +
        'color-stop(' +
        aux +
        ', #C5C5C5)' +
        ')';
    }
  });
}
