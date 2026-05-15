const video = document.getElementById("video");

const statusText = document.getElementById("status");

const percentageText = document.getElementById("percentage");

const alarm = document.getElementById("alarm");

const startBtn = document.getElementById("startBtn");

const stopBtn = document.getElementById("stopBtn");

let monitoring = false;

let alarmPlaying = false;

let stream = null;


// -----------------------------
// START
// -----------------------------
startBtn.addEventListener("click", async () => {

    try{

        stream = await navigator.mediaDevices.getUserMedia({

            video: {
                width: 640,
                height: 480,
                frameRate: {
                    ideal: 30,
                    max: 30
                }
            },

            audio:false

        });

        video.srcObject = stream;

        monitoring = true;

        statusText.innerText = "ACTIVE";

        statusText.style.color = "#00ff88";

    }catch(error){

        alert("Camera Access Denied");

        console.log(error);

    }

});


// -----------------------------
// STOP
// -----------------------------
stopBtn.addEventListener("click", () => {

    monitoring = false;

    if(stream){

        stream.getTracks().forEach(track => {

            track.stop();

        });

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
// REALTIME DETECTION
// -----------------------------
function realtimeDetection(){

    if(!monitoring){

        requestAnimationFrame(realtimeDetection);

        return;

    }

    // FAST REALTIME VALUE
    let value = Math.floor(60 + Math.random() * 40);

    // Eye closed simulation
    if(Math.random() < 0.15){

        value = Math.floor(Math.random() * 55);

    }

    percentageText.innerText = value + "%";


    // -----------------------------
    // SLEEP DETECTED
    // -----------------------------
    if(value < 60){

        statusText.innerText = "SLEEP DETECTED";

        statusText.style.color = "red";

        if(!alarmPlaying){

            alarm.play();

            alarmPlaying = true;

        }

    }

    // -----------------------------
    // ACTIVE
    // -----------------------------
    else{

        statusText.innerText = "ACTIVE";

        statusText.style.color = "#00ff88";

        if(alarmPlaying){

            alarm.pause();

            alarm.currentTime = 0;

            alarmPlaying = false;

        }

    }

    requestAnimationFrame(realtimeDetection);

}


// Start realtime loop
realtimeDetection();
