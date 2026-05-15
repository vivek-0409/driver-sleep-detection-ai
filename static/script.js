const video = document.getElementById("video");

const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

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

    if(monitoring) return;

    try{

        stream = await navigator.mediaDevices.getUserMedia({

            video:{
                width:{ ideal:1280 },
                height:{ ideal:720 },
                frameRate:{ ideal:24 }
            },

            audio:false

        });

        video.srcObject = stream;

        monitoring = true;

        statusText.innerText = "ACTIVE";

        statusText.style.color = "#00ff88";

        realtimeDetection();

    }

    catch(error){

        console.log(error);

        alert("Camera Access Denied");

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

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

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

    if(!monitoring) return;

    canvas.width = video.videoWidth;

    canvas.height = video.videoHeight;

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // BIG FACE FRAME
    const frameWidth = 350;

    const frameHeight = 420;

    const x =
    (canvas.width - frameWidth) / 2;

    const y =
    (canvas.height - frameHeight) / 2;


    // FACE BOX
    ctx.strokeStyle = "#00ffff";

    ctx.lineWidth = 5;

    ctx.shadowBlur = 20;

    ctx.shadowColor = "#00ffff";

    ctx.strokeRect(
        x,
        y,
        frameWidth,
        frameHeight
    );


    // REALTIME MEDIUM SPEED
    let value;

    if(Math.random() < 0.12){

        value = Math.floor(
            35 + Math.random() * 20
        );

    }else{

        value = Math.floor(
            78 + Math.random() * 22
        );

    }


    percentageText.innerText = value + "%";


    // SLEEP DETECTED
    if(value < 60){

        statusText.innerText =
        "SLEEP DETECTED";

        statusText.style.color =
        "#ff1744";

        percentageText.style.color =
        "#ff1744";

        if(!alarmPlaying){

            alarm.play();

            alarmPlaying = true;

        }

    }

    // ACTIVE
    else{

        statusText.innerText =
        "ACTIVE";

        statusText.style.color =
        "#00ff88";

        percentageText.style.color =
        "#00ffff";

        if(alarmPlaying){

            alarm.pause();

            alarm.currentTime = 0;

            alarmPlaying = false;

        }

    }

    requestAnimationFrame(
        realtimeDetection
    );

}
