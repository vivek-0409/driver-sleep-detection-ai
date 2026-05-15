const alarm = document.getElementById("alarm");

const statusText = document.getElementById("statusText");

const percentageText = document.getElementById("percentageText");

const startBtn = document.getElementById("startBtn");

const stopBtn = document.getElementById("stopBtn");

const videoFeed = document.getElementById("videoFeed");

let monitoring = false;

let alarmPlaying = false;

videoFeed.style.display = "none";

statusText.innerText = "STOPPED";

statusText.style.color = "orange";

percentageText.innerText = "--";


// -----------------------------
// START BUTTON
// -----------------------------
startBtn.addEventListener("click", () => {

    monitoring = true;

    videoFeed.style.display = "block";

    statusText.innerText = "STARTING...";

    statusText.style.color = "cyan";

});


// -----------------------------
// STOP BUTTON
// -----------------------------
stopBtn.addEventListener("click", () => {

    monitoring = false;

    // Stop alarm instantly
    alarm.pause();

    alarm.currentTime = 0;

    alarmPlaying = false;

    // Reset UI
    statusText.innerText = "STOPPED";

    statusText.style.color = "orange";

    percentageText.innerText = "--";

    // Hide camera
    videoFeed.style.display = "none";

});


// -----------------------------
// REALTIME STATUS
// -----------------------------
async function updateStatus(){

    // Agar monitoring OFF hai
    if(!monitoring){

        return;

    }

    try{

        const response = await fetch("/status");

        const data = await response.json();

        percentageText.innerText = data.percentage + "%";

        statusText.innerText = data.status;

        // Sleep detected
        if(data.percentage < 60){

            statusText.style.color = "red";

            // Alarm only when monitoring ON
            if(!alarmPlaying && monitoring){

                alarm.play();

                alarmPlaying = true;

            }

        }else{

            statusText.style.color = "lime";

            // Stop alarm instantly
            alarm.pause();

            alarm.currentTime = 0;

            alarmPlaying = false;

        }

    }catch(error){

        console.log(error);

    }

}

// Run every 500ms
setInterval(updateStatus, 500);