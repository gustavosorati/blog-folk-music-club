window.player = {
  playPause: document.querySelector('[data-js="music-play"]'),
  range: document.querySelector('[data-js="music-duration"]'),
  
  //  Define variables for control audio state
  audio: '',
  isPlaying: false,
  audioDuration: 0,
  audioData: audios,
  currentAudio: {},
  currentPlaying: 0,

  start() {
    this.playPause.onclick = () => this.next();

    // if(this.audio != ''){
    //   console.log('entrou')
    //   this.currentAudio = this.audioData[this.currentPlaying];
    //   this.play(this.currentAudio.src)

    //   console.log(this.audio);

    //   this.audio.addEventListener('ended', () => {
    //     this.currentPlaying === this.audioData.length - 1
    //       ? (this.currentPlaying = 0)
    //       : this.currentPlaying++;

    //     play();
    //   });
    // }
  },

  play(src) {
    if (this.audio === '') {
      this.audio = new Audio(src);
      this.play();
      // let elem = document.createElement('div');
      this.audioDuration = setInterval(this.rangeSlider, 1000);
       // // não pode retornar o valor // mas retorna
      // console.log("log 1: ")
      // console.log(elem)

      

      // console.log(player.audioDuration)

      // // this.audio.onloadedmetadata  = function() {
      // //   elem.innerHTML = this.duration;

      // //   console.log("log 2: ") 
      // //   console.log(elem)// tem q retonar o valor
      // // }

      // // this.audioDuration = +elem.innerText

      // console.log("log 3: " )
      // console.log(this.audioDuration) // deveria retornar o valor do this.duration
    } else if (this.audio.paused) {
      this.audio.play();
    } else {
      console.log('acabou e vai iniciar uma nova')
    }
  },
  fix(x) {
    player.audioDuration = x;
  },

  rangeSlider(){
    console.log('entrou 1')
    let position = 0;
    if(!isNaN(player.audio.duration)){
      console.log('entrou 2')
      console.log(player.range)

      position = player.audio.duration;
      player.range.max = position;

    }
  },
  pause() {
    this.audio.pause();
  },
  next() {
    this.currentAudio = this.audioData[this.currentPlaying];

    if (!this.isPlaying) {
      this.play(this.currentAudio.src);
      this.isPlaying = true;

      // this.range.max = this.duration;
      this.playPause.classList.remove('fa-play');
      this.playPause.classList.add('fa-pause');
    } else {
      this.pause();
      this.isPlaying = false;
      this.playPause.classList.remove('fa-pause');
      this.playPause.classList.add('fa-play');
    }
  },
  rangedVariance() {
    Song.currentTime = this.value;
  }
};
