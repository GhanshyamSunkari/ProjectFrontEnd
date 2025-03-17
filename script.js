// console.log("Hello, world!");
let currentSong = new Audio();
let audio_files = [];
//get the songs from the server and return the array of songs
async function getsongs() {
  let response = await fetch("http://127.0.0.1:3000/songs/");
  let text = await response.text();
  //   console.log(text);

  let div = document.createElement("div");
  div.innerHTML = text;

  let hrefs = div.getElementsByTagName("a");
  //   console.log(hrefs);
  let songs = [];
  for (let i = 0; i < hrefs.length; i++) {
    const element = hrefs[i];
    if (element.href.includes(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  //   console.log(songs);
  return songs;
}

const playMusic = (track, pause = false) => {
  // let audio = new Audio("/songs/"+track);
  currentSong.src = "/songs/" + track;
  if (!pause) {
    currentSong.play();
    play.src = "assets/pause.png";
  }
  document.querySelector(".currSonginfo").innerHTML = decodeURI(track); //using decodeURI to convert %20 to space
  document.querySelector(".timer").innerHTML = "00:00 / 00:00";
  // audio.play();
};

async function main() {
  //getting the songs
  audio_files = await getsongs();
  playMusic(audio_files[0], true);
  //console.log(audio_files);

  let songUL = document
    .querySelector(".songsList")
    .getElementsByTagName("ul")[0];
  for (const song of audio_files) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li>
          <img class="invert" src="assets/music.svg" alt="musiclogo" srcset="">
          <div class="songinfo">
              <div>${song.replaceAll("%20", " ")}</div>
              <div>Ghanshyam</div>
          </div>
          <div class="playnow">
              <span>Play Now</span>
              <img class="invert" src="assets/play.png" alt="playbut" srcset="">
          </div>
        </li>`;
  }
  //   playing the first song
  //   var audio = new Audio(audio_files[0]);
  //   audio.play();
  //   audio.addEventListener("loadeddata", () => {
  //     let duration = audio.duration;
  //     //console.log(duration);
  //     //duration of the song
  //   });

  //attach event listener to all songs
  Array.from(
    document.querySelector(".songsList").getElementsByTagName("li")
  ).forEach((e) => {
    //console.log(e.querySelector(".songinfo").children[0].innerText);
    e.addEventListener("click", (elements) => {
      //console.log(e.querySelector(".songinfo").firstElementChild.innerHTML);
      playMusic(
        e.querySelector(".songinfo").firstElementChild.innerHTML.trim()
      );
    });
  });

  //listen to the timeupdate event
  currentSong.addEventListener("timeupdate", () => {
    let duration = currentSong.duration || 0;
    let currentTime = currentSong.currentTime || 0;

    let minutes = Math.floor(currentTime / 60);
    let seconds = Math.floor(currentTime % 60);
    let totalMinutes = Math.floor(duration / 60);
    let totalSeconds = Math.floor(duration % 60);

    // Function to ensure two-digit format
    const formatTime = (time) => (time < 10 ? `0${time}` : time);

    document.querySelector(".timer").innerHTML = `${formatTime(
      minutes
    )}:${formatTime(seconds)} / ${formatTime(totalMinutes)}:${formatTime(
      totalSeconds
    )}`;

    document.querySelector(".progress").style.left =
      (currentTime / duration) * 100 + "%";

    //add event listener to the progress bar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
      let seekTime =
        (e.offsetX / e.target.getBoundingClientRect().width) * duration;

      document.querySelector(".progress").style.left =
        (seekTime / duration) * 100 + "%";
      currentSong.currentTime = seekTime;
    });
  });

  //add an event listener to the hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  //add an event listener to the close button
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
  });
  //Attach event listener to play
  document.querySelector("#play").addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "assets/pause.png";
    } else {
      currentSong.pause();
      play.src = "assets/play.png";
    }
  });
  // Add event listener to the previous button
  previous.addEventListener("click", () => {
    currentIndex = audio_files.indexOf(currentSong.src.split("/songs/")[1]);
    if((currentIndex-1)>=0){
      playMusic(audio_files[currentIndex-1]);
    }
  });
  // Add event listener to the next button

  next.addEventListener("click", () => {
    currentIndex = audio_files.indexOf(currentSong.src.split("/songs/")[1]);
    if (currentIndex + 1 < audio_files.length) {
      playMusic(audio_files[currentIndex + 1]);
      currentIndex++;
    } else {
      playMusic(audio_files[currentIndex]);
    }
  });

  //Add an event to the range input to control volume
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    console.log("Setting Volume to " + e.target.value + " / 100");
    currentSong.volume = parseInt(e.target.value)/100;
  })
}
main();
