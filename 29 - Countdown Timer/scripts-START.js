const remainTimeDisplay = document.querySelector('.display__time-left');
const endTimeDisplay = document.querySelector('.display__end-time');
const timeBtns = document.querySelectorAll('[data-time]');
const fnsBtns = document.querySelectorAll('.timer__functions button');
// the variable for setInterval to make clearInterval can work
let countdown;
let isCountdown = false;

function timer(countdownTime){
    clearInterval(countdown);

    const startTime = Date.now();
    const endTime = startTime + countdownTime * 1000;
    displayRemainTime(countdownTime);
    displayEndTime(endTime);
    
    countdown = setInterval(() => {
        isCountdown = true;
        const remainTime = Math.round((endTime - Date.now()) / 1000);
        // when remainTime < 0, stop the Interval
        if(remainTime < 0){
            isCountdown = false;
            clearInterval(countdown);
            // need to use return, otherwise it will run one more second then stop  
            return;
        }
        displayRemainTime(remainTime);
    },1000);
}

function displayRemainTime(time){
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    const display = `${mins < 10 ? 0 : ""}${mins}:${secs < 10 ? 0 : ""}${secs}`;
    // let countdown display on the browser tab
    document.title = display;
    remainTimeDisplay.textContent = display;
}

function displayEndTime(time){
    const end = new Date(time);
    // const hours = end.getHours();
    // const mins = end.getMinutes();
    // const display = `Be Back At ${hours}:${mins < 10 ? 0 : ""}${mins}`;
    
    // get time by setting the format option 
    const endTime = end.toString();
    const endTimeFormat = end.toLocaleTimeString([],{
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });
    const display = `Be Back At ${endTimeFormat}`;
    endTimeDisplay.textContent = display;
    endTimeDisplay.setAttribute('data-endtime',endTime);
}

function BtnSetTimer(){
    const conutdownTime = parseFloat(this.dataset.time)
    timer(conutdownTime);
}

function inputSetTimer(event){
    event.preventDefault();
    const conutdownTime = parseFloat(this.minutes.value) * 60;
    timer(conutdownTime);
    this.reset();
}

function fnsTimer(){
    const remainTime = document.querySelector('.display__time-left').textContent;
    if(this.textContent === "STOP" && isCountdown){
        remainTimeDisplay.textContent = remainTime;
        clearInterval(countdown);
        isCountdown = false;
    }else if(this.textContent === "CONTINUE" && !isCountdown && remainTime !== "00:00"){
        remainTimeAry = remainTime.split(':')
        const remainSecs = parseFloat(remainTimeAry[0]) * 60 + parseFloat(remainTimeAry[1]);
        timer(remainSecs);
    }
}

timeBtns.forEach(btn => btn.addEventListener('click',BtnSetTimer));
document.customForm.addEventListener('submit',inputSetTimer);
fnsBtns.forEach(btn => btn.addEventListener('click',fnsTimer))