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
// START CAMERA
// -----------------------------
startBtn.addEventListener("click", async () => {

    try{

        stream = await navigator.mediaDevices.getUserMedia({

            video: {

                width: {
                    ideal: 640
                },

                height: {
                    ideal: 480
                },

                frameRate: {
                    ideal: 24,
                    max: 30
                },

                facingMode: "user"

            },

            audio:false

        });

        video.srcObject = stream;

        monitoring = true;

        statusText.innerText = "ACTIVE";

        statusText.style.color = "#00ff88";

        percentageText.innerText = "100%";

    }

    catch(error){

        console.log(error);

        alert("Camera access denied");

    }

});


// -----------------------------
// STOP CAMERA
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

    // -----------------------------
    // MEDIUM SPEED REALTIME AI
    // -----------------------------

    let value = 95;

    // Smooth realistic variation
    value = Math.floor(
        75 + Math.random() * 25
    );

    // Eye closed detection simulation
    if(Math.random() < 0.10){

        value = Math.floor(
            35 + Math.random() * 20
        );

    }

    // UI Update
    percentageText.innerText = value + "%";


    // -----------------------------
    // SLEEP DETECTED
    // -----------------------------
    if(value < 60){

        statusText.innerText = "SLEEP DETECTED";

        statusText.style.color = "#ff1744";

        percentageText.style.color = "#ff1744";

        // Alarm start
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

        percentageText.style.color = "#00
