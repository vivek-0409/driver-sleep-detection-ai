# 🚗 Driver Sleep Detection AI

AI-based Driver Sleep Detection System using:

- Flask
- OpenCV
- MediaPipe
- Python
- HTML/CSS/JS

This system detects driver eye closure in real-time and plays an alarm when alertness goes below 60%.

---

# 📦 Requirements

```txt
Flask==3.0.3
opencv-python-headless==4.11.0.86
mediapipe==0.10.21
numpy<2
gunicorn



📁 Project Structure
driver_sleep_web/
│
├── app.py
├── requirements.txt
├── vercel.json
├── runtime.txt
│
├── templates/
│   └── index.html
│
├── static/
│   ├── style.css
│   ├── script.js
│   └── Alarm.wav
⚙️ Local Setup
STEP 1 — Open Terminal
cd C:\Users\NEEL\OneDrive\Desktop\Python\My_code\My_projects\driver_sleep_drain
STEP 2 — Activate Virtual Environment
.\mp-env\Scripts\activate
STEP 3 — Open Web Project Folder
cd ..\driver_sleep_web
STEP 4 — Check Python Version
python --version

Output should be:

Python 3.11.x
STEP 5 — Install Requirements
pip install -r requirements.txt
STEP 6 — Run Project
python app.py
🌐 Open In Browser
http://127.0.0.1:5000