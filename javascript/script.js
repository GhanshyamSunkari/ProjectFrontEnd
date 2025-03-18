// console.log("Hello, world!");
//here
let currentSong = new Audio();
let audio_files = [];
let currFolder;
//get the songs from the server and return the array of songs
async function getsongs(folder) {
  currFolder = folder;
  let response = await fetch(`https://github.com/GhanshyamSunkari/ProjectFrontEnd/tree/main/${folder}/`);
  let text = await response.text();
  //   console.log(text);

  let div = document.createElement("div");
  div.innerHTML = text;

  let hrefs = div.getElementsByTagName("a");
  //   console.log(hrefs);
  audio_files = [];
  for (let i = 0; i < hrefs.length; i++) {
    const element = hrefs[i];
    if (element.href.includes(".mp3")) {
      audio_files.push(element.href.split(`/${folder}/`)[1]);
    }
  }
  //   console.log(audio_files);

  //show all songs in playlist
  let songUL = document
    .querySelector(".songsList")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
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

  return audio_files;
}

const playMusic = (track, pause = false) => {
  // let audio = new Audio("/songs/"+track);
  currentSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "assets/pause.png";
  }
  document.querySelector(".currSonginfo").innerHTML = decodeURI(track); //using decodeURI to convert %20 to space
  document.querySelector(".timer").innerHTML = "00:00 / 00:00";
  // audio.play();
};

async function displayAlbums() {
  let response = await fetch(`https://github.com/GhanshyamSunkari/ProjectFrontEnd/tree/main/songs/`);
  let text = await response.text();
  //   console.log(text);

  let div = document.createElement("div");
  div.innerHTML = text;
  // console.log(div);
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");
  //console.log(cardContainer);
  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];

    if (e.href.includes("/songs")) {
      folder = e.href.split("/").slice(-2)[0];
      //Get the meta data of the folder
      let response = await fetch(
        `https://github.com/GhanshyamSunkari/ProjectFrontEnd/tree/main/songs/${folder}/info.json`
      );
      let json = await response.json();
      //console.log(json);

      cardContainer.innerHTML =
        cardContainer.innerHTML +
        `                    <div data-folder="${folder}" class="card">
                        <div class="playlogo">
                            <img src="assets/play.svg" alt="playbutton" srcset="">
                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="image" srcset="">
                        <h4>${json.title}</h4>
                        <p>${json.description}</p>
                    </div>`;
    }
  }

  //Load the library when ever card is clicked
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      audio_files = await getsongs(
        `songs/${item.currentTarget.dataset.folder}`
      );
      playMusic(audio_files[0]);
    });
  });
}

async function main() {
  //get the list of all songs
  await getsongs("songs/Hanuman");
  playMusic(audio_files[0], true);
  //console.log(audio_files);

  //Display all the albums on the page
  displayAlbums();

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
    if (currentIndex - 1 >= 0) {
      playMusic(audio_files[currentIndex - 1]);
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
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      console.log("Setting Volume to " + e.target.value + " / 100");
      currentSong.volume = parseInt(e.target.value) / 100;
    });

    //Add event listener to  mute the track
    document.querySelector(".volume>img").addEventListener("click",(e)=>{
      // console.log(e.target);
      if(e.target.src.includes("assets/volumeRocker.png")){
        e.target.src = e.target.src.replace("assets/volumeRocker.png","assets/mute.png");
        currentSong.volume=0;
        document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value=0;
      }
      else{
        e.target.src = e.target.src.replace("assets/mute.png","assets/volumeRocker.png")
        currentSong.volume=.1;
        document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value=10;
      }
    });
}
main();
