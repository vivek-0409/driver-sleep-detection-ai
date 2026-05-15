const video = document.getElementById("video");

const statusText = document.getElementById("status");

const percentageText = document.getElementById("percentage");

const alarm = document.getElementById("alarm");

const startBtn = document.getElementById("startBtn");

const stopBtn = document.getElementById("stopBtn");

let monitoring = false;

let alarmPlaying = false;

let camera;


// -----------------------------
// START
// -----------------------------
startBtn.addEventListener("click", async () => {

    monitoring = true;

    const stream = await navigator.mediaDevices.getUserMedia({
        video:true
    });

    video.srcObject = stream;

    statusText.innerText = "ACTIVE";

    statusText.style.color = "lime";

});


// -----------------------------
// STOP
// -----------------------------
stopBtn.addEventListener("click", () => {

    monitoring = false;

    const stream = video.srcObject;

    if(stream){

        stream.getTracks().forEach(track => track.stop());

    }

    video.srcObject = null;

    alarm.pause();

    alarm.currentTime = 0;

    alarmPlaying = false;

    statusText.innerText = "STOPPED";

    statusText.style.color = "orange";

    percentageText.innerText = "--";

});


// -----------------------------
// DEMO AI DETECTION
// -----------------------------
setInterval(() => {

    if(!monitoring) return;

    let value = Math.floor(Math.random() * 100);

    percentageText.innerText = value + "%";

    if(value < 60){

        statusText.innerText = "SLEEP DETECTED";

        statusText.style.color = "red";

        if(!alarmPlaying){

            alarm.play();

            alarmPlaying = true;

        }

    }else{

        statusText.innerText = "ACTIVE";

        statusText.style.color = "lime";

        alarm.pause();

        alarm.currentTime = 0;

        alarmPlaying = false;

    }

}, 1000);
