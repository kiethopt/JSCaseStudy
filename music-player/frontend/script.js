const apiUrl = "https://jscasestudy.onrender.com/songs";

const $ = document.querySelector.bind(document);
const $$ = document.querySelector.bind(document);

const player = $(".player");
const playlist = $(".playlist");
const heading = $("header h2");
const cd = $(".cd");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");

let currentIndex = 0;
let songsData = [];
let isPlaying = false;
let isRandom = false;
let isRepeat = false;

async function fetchSongs() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      console.log("Không lấy được dữ liệu");
    }

    songsData = await response.json();
    renderPlaylist();
    loadCurrentSong();
    scrollActiveSongIntoView();
  } catch (error) {
    console.log("Error: ", error);
  }
}

function renderPlaylist() {
  const htmls = songsData.map((song, index) => {
    return `
        <div class="song ${
          index === currentIndex ? "active" : ""
        }" data-index="${index}">
            <div class="thumb" style="background-image: url('${
              song.cover
            }')"></div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.authors}</p>
            </div>
            <div class="option">
                <i class="fas fa-bars"></i>
            </div>
        </div>
    `;
  });
  playlist.innerHTML = htmls.join("");

  // Thêm sự kiện load image error để thay thế bằng ảnh mặc định
  document.querySelectorAll(".thumb").forEach((thumb) => {
    thumb.addEventListener("error", function () {
      this.style.backgroundImage = "url('./assets/img/Blinding_Lights.jpg')";
    });
  });

  // Thêm sự kiện load image error để thay thế bằng ảnh mặc định
  document.querySelectorAll(".thumb").forEach((img) => {
    const url = img.style.backgroundImage.slice(5, -2);
    const imgElement = new Image();
    imgElement.src = url;
    imgElement.onload = () => {
      img.style.backgroundImage = `url('${url}')`;
    };
    imgElement.onerror = () => {
      img.style.backgroundImage = "url('./assets/img/Blinding_Lights.jpg')";
    };
  });

  // Gọi scrollActiveSongIntoView sau khi render xong
  scrollActiveSongIntoView();
}

function loadCurrentSong() {
  const song = songsData[currentIndex];
  heading.textContent = song.name;
  cdThumb.style.backgroundImage = `url(${song.cover})`;

  const imgElement = new Image();
  imgElement.src = song.cover;
  imgElement.onload = () => {
    cdThumb.style.backgroundImage = `url(${song.cover})`;
  };
  imgElement.onerror = () => {
    cdThumb.style.backgroundImage = "url('./assets/img/Blinding_Lights.jpg')";
  };

  audio.src = song.path;
}

// Handle Play & Pause
function handlePlayPause() {
  if (isPlaying) {
    audio.pause();
  } else {
    audio.play();
  }
}

// Handle Play
audio.onplay = function () {
  isPlaying = true;
  player.classList.add("playing");
  cdThumbAnimate.play();
};

// Handle Pause
audio.onpause = function () {
  isPlaying = false;
  player.classList.remove("playing");
  cdThumbAnimate.pause();
};

// Handle progress change
audio.ontimeupdate = function () {
  if (audio.duration) {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progress.value = progressPercent;
  }
};

// Seek song
progress.oninput = function (e) {
  const seekTime = (audio.duration / 100) * e.target.value;
  audio.currentTime = seekTime;
};

// Next song
function nextSong() {
  currentIndex++;
  if (currentIndex >= songsData.length) {
    currentIndex = 0;
  }
  loadCurrentSong();
  audio.play();
  renderPlaylist();
  scrollActiveSongIntoView();
}

// Prev song
function prevSong() {
  currentIndex--;
  if (currentIndex < 0) {
    currentIndex = songsData.length - 1;
  }
  loadCurrentSong();
  audio.play();
  renderPlaylist();
  scrollActiveSongIntoView();
}

// Play random song
function playRandomSong() {
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * songsData.length);
  } while (randomIndex === currentIndex);
  currentIndex = randomIndex;
  loadCurrentSong();
  audio.play();
  renderPlaylist();
  scrollActiveSongIntoView();
}

// Function: scrollIntoView() method
function scrollActiveSongIntoView() {
  setTimeout(() => {
    const activeSong = $(".song.active");
    if (activeSong) {
      activeSong.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, 300);
}

playlist.onclick = function (e) {
  const songNode = e.target.closest(".song:not(.active)");
  if (songNode) {
    currentIndex = Number(songNode.dataset.index);
    loadCurrentSong();
    renderPlaylist();
    audio.play();
    scrollActiveSongIntoView();
  }
};

// CD thumb animation
const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
  duration: 10000, // 10 seconds
  iterations: Infinity,
});
cdThumbAnimate.pause();

// Event listeners
playBtn.onclick = handlePlayPause;
nextBtn.onclick = () => {
  if (isRandom) {
    playRandomSong();
  } else {
    nextSong();
  }
  scrollActiveSongIntoView();
  renderPlaylist();
};
prevBtn.onclick = () => {
  prevSong();
  scrollActiveSongIntoView();
  renderPlaylist();
};
randomBtn.onclick = () => {
  isRandom = !isRandom;
  if (isRandom) {
    isRepeat = false;
    repeatBtn.classList.remove("active");
  }
  randomBtn.classList.toggle("active", isRandom);
};
repeatBtn.onclick = () => {
  isRepeat = !isRepeat;
  if (isRepeat) {
    isRandom = false;
    randomBtn.classList.remove("active");
  }
  repeatBtn.classList.toggle("active", isRepeat);
};

audio.onended = function () {
  if (isRepeat) {
    audio.play();
  } else if (isRandom) {
    playRandomSong();
  } else {
    nextSong();
  }
};

const cdWidth = cd.offsetWidth;

player.onscroll = function () {
  const scrollTop = player.scrollTop;
  const newCdWidth = cdWidth - scrollTop;

  if (newCdWidth >= 60) {
    cd.style.width = newCdWidth + "px";
    cd.style.height = newCdWidth + "px";
    cd.style.opacity = newCdWidth / cdWidth;
  } else {
    cd.style.width = "60px";
    cd.style.height = "60px";
    cd.style.opacity = "0.3"; // Độ mờ tối thiểu để giữ cho hình ảnh có thể nhìn thấy
  }
};

// Khởi tạo Sortable.js trên playlist
const sortable = new Sortable(playlist, {
  animation: 150,
  handle: ".fa-bars",
  onEnd: function (evt) {
    const newIndex = evt.newIndex;
    const oldIndex = evt.oldIndex;
    if (newIndex !== oldIndex) {
      // Cập nhật danh sách bài hát sau khi sắp xếp lại
      const movedItem = songsData.splice(oldIndex, 1)[0];
      songsData.splice(newIndex, 0, movedItem);

      // Manually update the DOM to reflect the new order
      const nodeList = Array.from(playlist.children);
      const movedNode = nodeList[oldIndex];
      const referenceNode = nodeList[newIndex];

      // Ensure nodes are not undefined
      if (movedNode && referenceNode) {
        playlist.insertBefore(movedNode, referenceNode);
      } else if (movedNode) {
        playlist.appendChild(movedNode);
      }

      // Duy trì trạng thái bài hát hiện tại
      const currentTime = audio.currentTime;
      const wasPlaying = !audio.paused;
      loadCurrentSong();
      audio.currentTime = currentTime;
      if (wasPlaying) {
        audio.play();
      }
    }
  },
});

// Gọi
fetchSongs();
