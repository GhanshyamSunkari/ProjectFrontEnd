let currentSong = new Audio();
let audio_files = [];
let currFolder;

// ✅ Function to get songs from `info.json`
async function getsongs(folder) {
  currFolder = folder;
  
  try {
    let response = await fetch(`https://ghanshyamsunkari.github.io/ProjectFrontEnd/${folder}/info.json`);
    if (!response.ok) throw new Error("Failed to fetch song list.");
    
    let json = await response.json();
    audio_files = json.songs;

    // Display songs in the playlist
    let songUL = document.querySelector(".songsList ul");
    songUL.innerHTML = "";
    
    audio_files.forEach(song => {
      songUL.innerHTML += `
        <li>
          <img class="invert" src="assets/music.svg" alt="musiclogo">
          <div class="songinfo">
              <div>${song.replaceAll("%20", " ")}</div>
              <div>Ghanshyam</div>
          </div>
          <div class="playnow">
              <span>Play Now</span>
              <img class="invert" src="assets/play.png" alt="play">
          </div>
        </li>`;
    });

    // Attach event listeners to play songs
    document.querySelectorAll(".songsList li").forEach((e, index) => {
      e.addEventListener("click", () => {
        playMusic(audio_files[index]);
      });
    });

  } catch (error) {
    console.error("Error loading songs:", error);
  }
}

// ✅ Function to play music
const playMusic = (track, pause = false) => {
  currentSong.src = `https://ghanshyamsunkari.github.io/ProjectFrontEnd/${currFolder}/` + track;
  
  if (!pause) {
    currentSong.play();
    document.getElementById("play").src = "assets/pause.png";
  }
  
  document.querySelector(".currSonginfo").innerHTML = decodeURI(track);
  document.querySelector(".timer").innerHTML = "00:00 / 00:00";
};

// ✅ Function to display album cards
async function displayAlbums() {
  let cardContainer = document.querySelector(".cardContainer");
  cardContainer.innerHTML = "";

  try {
    // Manually list album folders since GitHub Pages doesn’t allow directory listing
    let albums = ["Hanuman", "Shiva"];  // ✅ Add more album folders here

    for (let folder of albums) {
      let response = await fetch(`https://ghanshyamsunkari.github.io/ProjectFrontEnd/songs/${folder}/info.json`);
      if (!response.ok) continue;  // Skip if info.json is missing

      let json = await response.json();

      cardContainer.innerHTML += `
        <div data-folder="${folder}" class="card">
          <div class="playlogo">
              <img src="assets/play.svg" alt="playbutton">
          </div>
          <img src="https://ghanshyamsunkari.github.io/ProjectFrontEnd/songs/${folder}/cover.jpg" alt="cover">
          <h4>${json.title}</h4>
          <p>${json.description}</p>
        </div>`;
    }

    // Attach event listeners to album cards
    document.querySelectorAll(".card").forEach(e => {
      e.addEventListener("click", async (item) => {
        audio_files = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
        playMusic(audio_files[0]);
      });
    });

  } catch (error) {
    console.error("Error loading albums:", error);
  }
}

// ✅ Main function
async function main() {
  await getsongs("songs/Hanuman");  // ✅ Default album
  playMusic(audio_files[0], true);

  displayAlbums();

  // ✅ Add event listeners for controls
  document.getElementById("play").addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      document.getElementById("play").src = "assets/pause.png";
    } else {
      currentSong.pause();
      document.getElementById("play").src = "assets/play.png";
    }
  });

  document.getElementById("previous").addEventListener("click", () => {
    let currentIndex = audio_files.indexOf(currentSong.src.split("/").pop());
    if (currentIndex > 0) {
      playMusic(audio_files[currentIndex - 1]);
    }
  });

  document.getElementById("next").addEventListener("click", () => {
    let currentIndex = audio_files.indexOf(currentSong.src.split("/").pop());
    if (currentIndex < audio_files.length - 1) {
      playMusic(audio_files[currentIndex + 1]);
    }
  });

  document.querySelector(".volume>img").addEventListener("click", (e) => {
    if (e.target.src.includes("assets/volumeRocker.png")) {
      e.target.src = "assets/mute.png";
      currentSong.volume = 0;
      document.querySelector(".range input").value = 0;
    } else {
      e.target.src = "assets/volumeRocker.png";
      currentSong.volume = 0.1;
      document.querySelector(".range input").value = 10;
    }
  });

  document.querySelector(".range input").addEventListener("change", (e) => {
    currentSong.volume = parseInt(e.target.value) / 100;
  });

  // ✅ Update progress bar
  currentSong.addEventListener("timeupdate", () => {
    let duration = currentSong.duration || 0;
    let currentTime = currentSong.currentTime || 0;

    let formatTime = (time) => (time < 10 ? `0${time}` : time);
    
    document.querySelector(".timer").innerHTML = `${formatTime(Math.floor(currentTime / 60))}:${formatTime(Math.floor(currentTime % 60))} / ${formatTime(Math.floor(duration / 60))}:${formatTime(Math.floor(duration % 60))}`;

    document.querySelector(".progress").style.left = (currentTime / duration) * 100 + "%";
  });

  // ✅ Seekbar interaction
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let duration = currentSong.duration;
    let seekTime = (e.offsetX / e.target.getBoundingClientRect().width) * duration;
    currentSong.currentTime = seekTime;
  });

  // ✅ Sidebar toggles
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
  });
}

// ✅ Run the script
main();
