let player = document.querySelector(".player");
let video = player.querySelector(".viewer");
let playBtn = player.querySelector(".toggle");
let progressBar = player.querySelector(".progress");
let process = player.querySelector(".progress__filled");
let sliders = player.querySelectorAll(".player__slider");
let skipBtns = player.querySelectorAll("[data-skip]");

// use video.paused to check do video.play() or video.pause()
function togglePlay(){
    video[video.paused ? "play" : "pause"]();
}

// use video.paused to change playBtn textContent
function updatePlayBtn(){
    playBtn.textContent = this.paused ? "►" : "❚ ❚";
}

// use video.currentTime transfer to percentage, then change process style
function updateProgress(){
    let percentage = (video.currentTime / video.duration) * 100;
    process.style.flexBasis = `${percentage}%`;
}

// use offsetX to define the position of progress
// progressBar.offsetWidth is total width of progressBar
function dragProgress(event){
    video.currentTime = (event.offsetX / progressBar.offsetWidth) * video.duration;
}

// use this.name/this.value to get volume/volume's value and playbackRate/playbackRate's value, then give to value to the video
function updateRange(){
    video[this.name] = this.value;
}

// use this.dataset.skip to get skip value
function skipAction(){
    video.currentTime += parseFloat(this.dataset.skip);
}

// video play/pause
video.addEventListener("click",togglePlay);
playBtn.addEventListener("click",togglePlay);

// change icon of play/pause botton
video.addEventListener("play",updatePlayBtn);
video.addEventListener("pause",updatePlayBtn);

// update progress bar
let isMouseDown = false;
video.addEventListener("timeupdate",updateProgress);
progressBar.addEventListener("click",dragProgress);
progressBar.addEventListener("mousedown",() => isMouseDown = true);
progressBar.addEventListener("mouseup",() => isMouseDown = false);
progressBar.addEventListener("mousemove",(event) => isMouseDown && dragProgress(event));

// volume and playbackRate
sliders.forEach(slider => slider.addEventListener("input",updateRange));

// skip button
skipBtns.forEach(skip => skip.addEventListener("click",skipAction))