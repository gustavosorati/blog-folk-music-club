/**
 * Music Meta
 */
(function (window) {
  const baseUrl = 'https://dev-assets.investisdigital.com/temp/';

  function MusicMeta({ title, artist, album, slug }) {
    this.title = title;
    this.src = `${baseUrl}/assets/bensound-${slug}.mp3`;
    this.artist = artist;
    this.album = album;
    this.artwork = [96, 128, 192, 256, 512].map((size) => {
      return {
        src: `${baseUrl}/assets/${slug}-${size}_x_${size}.jpg`,
        sizes: `${size}x${size}`,
        type: 'image/jpg',
      };
    });
  }

  window.MusicMeta = MusicMeta;
})(window);

/**
 * Music player
 */
(function (window, navigator) {
  const audio = document.createElement('audio');
  const progressBar = document.querySelector('.progress');
  const playPauseButton = document.querySelector('#playPauseButton');
  const playPauseButtonIcon = playPauseButton.querySelector('i');
  const defaultSeekTime = 10; /** Seconds */
  let currentTrackIndex = 0;
  let previousTrackIndex = 0;
  let playlistData = null;

  const noop = () => {}; // no operation

  /**
   * Handle unsupported APIs to prevent errors
   */
  if (!('mediaSession' in navigator)) {
    console.warn('The Media Session API is not available! ¯_(ツ)_/¯');

    window.MediaMetadata = noop;

    navigator.mediaSession = {
      setActionHandler: noop,
      setPositionState: noop,
    };
  }

  /**
   * Playback functions & Media Session API action handlers
   */
  async function resume() {
    await audio.play();
    updatePositionState();
    navigator.mediaSession.playbackState = 'playing';

    playPauseButtonIcon.classList.replace('fa-play', 'fa-pause');
  }
  navigator.mediaSession.setActionHandler('play', resume);

  function pause() {
    audio.pause();
    navigator.mediaSession.playbackState = 'paused';

    playPauseButtonIcon.classList.replace('fa-pause', 'fa-play');
  }
  navigator.mediaSession.setActionHandler('pause', pause);

  function stop() {
    audio.pause();
    audio.currentTime = 0;

    playPauseButtonIcon.classList.replace('fa-pause', 'fa-play');
  }
  navigator.mediaSession.setActionHandler('stop', stop);

  function nextTrack() {
    // Update previous track index before updating the current one
    previousTrackIndex = currentTrackIndex;

    if (currentTrackIndex + 1 === playlistData.length) {
      currentTrackIndex = 0;
    } else {
      currentTrackIndex = currentTrackIndex + 1;
    }
    playOrResumeCurrentTrack();
  }
  navigator.mediaSession.setActionHandler('nexttrack', nextTrack);

  function previousTrack() {
    // Update previous track index before updating the current one
    previousTrackIndex = currentTrackIndex;

    if (currentTrackIndex - 1 === -1) {
      currentTrackIndex = playlistData.length - 1;
    } else {
      currentTrackIndex = currentTrackIndex - 1;
    }
    playOrResumeCurrentTrack();
  }
  navigator.mediaSession.setActionHandler('previoustrack', previousTrack);

  function seekBackward(event) {
    audio.currentTime = Math.max(
      audio.currentTime - (event.seekOffset || defaultSeekTime),
      0,
    );
    updatePositionState();
  }
  navigator.mediaSession.setActionHandler('seekbackward', seekBackward);

  function seekForward(event) {
    audio.currentTime = Math.min(
      audio.currentTime + (event.seekOffset || defaultSeekTime),
      audio.duration,
    );
    updatePositionState();
  }
  navigator.mediaSession.setActionHandler('seekforward', seekForward);

  function updatePositionState() {
    const { duration, playbackRate, currentTime } = audio;

    navigator.mediaSession.setPositionState({
      duration: duration,
      playbackRate: playbackRate,
      position: currentTime,
    });
  }

  function updateMetadata() {
    const currentTrack = playlistData[currentTrackIndex];
    console.log(`Now playing "${currentTrack.title}" track...`);

    navigator.mediaSession.metadata = new MediaMetadata(currentTrack);

    updatePositionState();
  }

  function playOrResumeCurrentTrack() {
    if (audio.src && currentTrackIndex === previousTrackIndex) {
      resume();
    } else {
      audio.src = playlistData[currentTrackIndex].src;

      audio
        .play()
        .then((_) => {
          updateMetadata();
          playPauseButtonIcon.classList.replace('fa-play', 'fa-pause');
        })
        .catch((error) => console.log(error));
    }
  }

  /**
   * Playback media control listeners
   */
  playPauseButton.addEventListener('click', () =>
    audio.paused ? playOrResumeCurrentTrack() : pause(),
  );

  document
    .querySelector('#previousButton')
    .addEventListener('click', previousTrack);
  document.querySelector('#nextButton').addEventListener('click', nextTrack);
  document
    .querySelector('#backwardButton')
    .addEventListener('click', seekBackward);
  document
    .querySelector('#forwardButton')
    .addEventListener('click', seekForward);

  // Update progress bar as music progresses
  audio.addEventListener('timeupdate', () => {
    progressBar.style.width = (audio.currentTime / audio.duration) * 100 + '%';
  });

  // Update active class on the playlist
  audio.addEventListener('play', () => {
    document
      .querySelector(`.track-${previousTrackIndex}`)
      .classList.remove('table-active', 'playing');
    document
      .querySelector(`.track-${currentTrackIndex}`)
      .classList.add('table-active', 'playing');
  });

  // Automatically play next when the current track ends...
  audio.addEventListener('ended', nextTrack);

  /**
   * Playlist UI generation
   */
  function generateTableCell(content) {
    const cell = document.createElement('td');

    if (typeof content === 'string') {
      const text = document.createTextNode(content);
      cell.appendChild(text);
    } else if (content) {
      cell.appendChild(content);
    }

    return cell;
  }

  function generatePlaylistRow(data, rowIndex) {
    const row = document.createElement('tr');
    row.classList.add(`track-${rowIndex}`); // to set active class later

    const fragment = document.createDocumentFragment();

    const thumbnail = document.createElement('img');
    thumbnail.src = data.artwork[0].src;
    thumbnail.setAttribute('height', '44px');
    thumbnail.setAttribute('width', '44px');

    fragment.appendChild(generateTableCell(thumbnail));
    fragment.appendChild(generateTableCell(data.title));
    fragment.appendChild(generateTableCell(data.artist));
    fragment.appendChild(generateTableCell(data.album));

    row.appendChild(fragment);

    return row;
  }

  function generatePlaylistHeader() {
    const thead = document.createElement('thead');
    const row = thead.insertRow();
    const fragment = document.createDocumentFragment();

    ['Artwork', 'Title', 'Artist', 'Album'].forEach((column) => {
      const th = document.createElement('th');
      const text = document.createTextNode(column);

      th.appendChild(text);
      fragment.appendChild(th);
    });

    row.appendChild(fragment);

    return thead;
  }

  function generatePlaylist() {
    const playlist = document.createElement('table');
    playlist.classList.add('table', 'table-hover', 'playlist');

    const tableFragment = document.createDocumentFragment();

    // Playlist header
    const header = generatePlaylistHeader();
    tableFragment.appendChild(header);

    // Playlist rows
    const tbodyFragment = document.createDocumentFragment();
    playlistData.forEach((item, index) => {
      const row = generatePlaylistRow(item, index);
      tbodyFragment.appendChild(row);
    });

    const tbody = document.createElement('tbody');
    tbody.appendChild(tbodyFragment);

    tableFragment.appendChild(tbody);

    // Append everything to playlist table
    playlist.appendChild(tableFragment);

    return playlist;
  }

  /**
   * Code execution begins from here..
   */
  function MusicPlayer(container, data) {
    playlistData = [...data];

    const playlist = generatePlaylist(data);
    container.appendChild(playlist);
  }

  window.MusicPlayer = MusicPlayer;
})(window, navigator);

/**
 * Attach and load
 */
(function () {
  const playlistData = [
    new MusicMeta({
      title: 'Memories',
      artist: 'Benjamin Tissot',
      album: 'Bensound',
      slug: 'memories',
    }),
    new MusicMeta({
      title: 'Sunny',
      artist: 'Benjamin',
      album: 'Bensound',
      slug: 'sunny',
    }),
    new MusicMeta({
      title: 'Once again',
      artist: 'Benjamin T.',
      album: 'Bensound',
      slug: 'onceagain',
    }),
  ];
  new MusicPlayer(document.querySelector('.player'), playlistData);
})();
