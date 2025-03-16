// console.log("Hello, world!");

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

async function main() {
  //getting the songs
  let audio_files = await getsongs();
  //console.log(audio_files);

  let songUL = document.querySelector(".songsList").getElementsByTagName("ul")[0];

  for (const song of audio_files) {
    songUL.innerHTML = songUL.innerHTML + 
    `                            <li>
                                <img class="invert" src="assets/music.svg" alt="musiclogo" srcset="">
                                <div class="songinfo">
                                    <div>${song.replaceAll("%20"," ")}</div>
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
} 
main();
