console.log('lets write js')
let currentSong = new Audio();

function secondsToTimeFormat(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "Invalid input";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = parseInt(seconds % 60);

    const minuteString = (minutes < 10) ? "0" + minutes : minutes;
    const secondString = (remainingSeconds < 10) ? "0" + remainingSeconds : remainingSeconds;

    return `${minuteString}:${secondString}`;
}

async function getSongs(){
    let a = await fetch("http://127.0.0.1:5500/songs/")
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    let songs = []
    for(let idx = 0;idx < as.length;idx++){
        const element = as[idx];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1]);
        }
    }

    return songs;
}

const playMusic = (track,pause = false) =>{
    // let audio = new Audio("/songs/" + track)
    currentSong.src = "/songs/" + track;
    if(!pause) {
        currentSong.play()
        play.src = "pause.svg"
    }
    currentSong.play()
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

}

async function main(){
    //get the lost of the all song
    let songs = await getSongs()
    // playMusic(songs[0],true)

    //show all the songs of the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for(const song of songs){
        songUL.innerHTML = songUL.innerHTML + `<li> 
                            <img class = "invert" src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20"," ")}</div>
                                <div>Saurabh</div>
                            </div>
                            <div class="playNow flex justify-content item-center">
                                <span>Play Now</span>
                                <img class = "invert" src="play.svg" alt="">
                            </div>
                             </li>`;
    }

    //attach eventlistener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e =>{
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML) 
        })
    })

    //attach eventlistener to play ,next and previous song
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            // currentSong.play()
            currentSong.play()
            play.src = "pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "play.svg"
        }
    })

    //listen for time update
    currentSong.addEventListener("timeupdate",()=>{
        // console.log(currentSong.currentTime,currentSong.duration);
        // console.log(secondsToTimeFormat(currentSong.currentTime))
        document.querySelector(".songtime").innerHTML = `${secondsToTimeFormat(currentSong.currentTime)} / ${secondsToTimeFormat(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100 + "%"
        if (Math.abs(currentSong.currentTime - currentSong.duration) < 0.1) {
            play.src = "play.svg"; // Change the play button SVG to "play.svg"
        }
    })

    //add evenetlistener to seekbar
    document.querySelector(".seekbar").addEventListener("click",(e) =>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = currentSong.duration * (percent/100)
    })

    //add an eventlistener for hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "0"
    })

    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-120%"
    })
}

main()