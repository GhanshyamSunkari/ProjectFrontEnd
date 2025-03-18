let currentSong = new Audio();
let audio_files = [];
let currFolder;
let lastVolume = 0.5; // Default volume

// ✅ Function to get songs from an album's `info.json`
async function getsongs(folder) {
  currFolder = folder;
  
  try {
    let response = await fetch(`https://ghanshyamsunkari.github.io/ProjectFrontEnd/${folder}/info.json`);
    if (!response.ok) throw new Error("Failed to fetch song list.");
    
    let json = await response.json();
    audio_files = json.songs;

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

    document.querySelectorAll(".songsList li").forEach((e, index) => {
      e.addEventListener("click", () => {
        playMusic(audio_files[index]);
      });
    });

  } catch (error) {
    console.error("Error loading songs:", error);
  }
}

// ✅ Function to play a selected song
const playMusic = (track, pause = false) => {
  currentSong.src = `https://ghanshyamsunkari.github.io/ProjectFrontEnd/${currFolder}/` + track;
  
  if (!pause) {
    currentSong.play();
    document.getElementById("play").src = "assets/pause.png";
  }
  
  document.querySelector(".currSonginfo").innerHTML = decodeURI(track);
  document.querySelector(".timer").innerHTML = "00:00 / 00:00";
};

// ✅ Function to display albums dynamically
async function displayAlbums() {
  let cardContainer = document.querySelector(".cardContainer");
  cardContainer.innerHTML = "";

  try {
    let response = await fetch("https://ghanshyamsunkari.github.io/ProjectFrontEnd/songs/albums.json");
    if (!response.ok) throw new Error("Failed to fetch album list.");
    let { albums } = await response.json();

    for (let folder of albums) {
      try {
        let res = await fetch(`https://ghanshyamsunkari.github.io/ProjectFrontEnd/songs/${folder}/info.json`);
        if (!res.ok) throw new Error(`Missing info.json for ${folder}`);
        let json = await res.json();
        cardContainer.innerHTML += `
          <div data-folder="${folder}" class="card">
            <div class="playlogo">
                <img src="assets/play.svg" alt="playbutton">
            </div>
            <img src="https://ghanshyamsunkari.github.io/ProjectFrontEnd/songs/${folder}/cover.jpg" alt="cover">
            <h4>${json.title}</h4>
            <p>${json.description}</p>
          </div>`;
      } catch (albumError) {
        console.warn(albumError.message);
      }
    }

    document.querySelectorAll(".card").forEach(e => {
      e.addEventListener("click", async (item) => {
        let folder = `songs/${item.currentTarget.dataset.folder}`;
        await getsongs(folder);
        if (audio_files.length > 0) playMusic(audio_files[0]);
      });
    });

  } catch (error) {
    console.error("Error loading albums:", error);
  }
}

// ✅ Main function
async function main() {
  await displayAlbums();
  let response = await fetch("https://ghanshyamsunkari.github.io/ProjectFrontEnd/songs/albums.json");
  if (response.ok) {
    let { albums } = await response.json();
    if (albums.length > 0) {
      await getsongs(`songs/${albums[0]}`);
      playMusic(audio_files[0], true);
    }
  }

  // ✅ Player controls
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
    let currentIndex = audio_files.indexOf(decodeURIComponent(currentSong.src.split("/").pop()));
    if (currentIndex > 0) {
      playMusic(audio_files[currentIndex - 1]);
    }
  });

  document.getElementById("next").addEventListener("click", () => {
    let currentIndex = audio_files.indexOf(decodeURIComponent(currentSong.src.split("/").pop()));
    if (currentIndex < audio_files.length - 1) {
      playMusic(audio_files[currentIndex + 1]);
    }
  });

  // ✅ Seek bar updates
  currentSong.addEventListener("timeupdate", () => {
    let duration = currentSong.duration || 0;
    let currentTime = currentSong.currentTime || 0;
    if (duration > 0) {
      let formatTime = (time) => (time < 10 ? `0${time}` : time);
      document.querySelector(".timer").innerHTML = `${formatTime(Math.floor(currentTime / 60))}:${formatTime(Math.floor(currentTime % 60))} / ${formatTime(Math.floor(duration / 60))}:${formatTime(Math.floor(duration % 60))}`;
      document.querySelector(".progress").style.left = (currentTime / duration) * 100 + "%";
    }
  });

  // ✅ Volume mute/unmute
  document.querySelector(".volume>img").addEventListener("click", (e) => {
    if (e.target.src.includes("assets/volumeRocker.png")) {
      lastVolume = currentSong.volume;
      e.target.src = "assets/mute.png";
      currentSong.volume = 0;
      document.querySelector(".range input").value = 0;
    } else {
      e.target.src = "assets/volumeRocker.png";
      currentSong.volume = lastVolume;
      document.querySelector(".range input").value = lastVolume * 100;
    }
  });

  // ✅ Mobile menu controls
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
  });
}

// ✅ Run the script
main();