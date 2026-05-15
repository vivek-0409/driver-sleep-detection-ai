from flask import Flask, render_template, Response, jsonify

app = Flask(__name__)

# -----------------------------
# MediaPipe Setup
# -----------------------------
mp_face_mesh = mp.solutions.face_mesh

face_mesh = mp_face_mesh.FaceMesh(
    static_image_mode=False,
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

# Eye landmarks
L_EYE_UP, L_EYE_DOWN, L_EYE_LEFT, L_EYE_RIGHT = 159, 145, 33, 133
R_EYE_UP, R_EYE_DOWN, R_EYE_LEFT, R_EYE_RIGHT = 386, 374, 362, 263

EYE_RATIO_THRESHOLD = 0.20

sleep_percentage = 100
sleep_status = "ACTIVE"

# -----------------------------
# Helper Functions
# -----------------------------
def landmark_to_point(landmark, image_w, image_h):
    return int(landmark.x * image_w), int(landmark.y * image_h)

def euclidean(a, b):
    a, b = np.array(a), np.array(b)
    return np.linalg.norm(a - b)

def compute_eye_ratio(landmarks, image_w, image_h, up_idx, down_idx, left_idx, right_idx):
    up = landmark_to_point(landmarks[up_idx], image_w, image_h)
    down = landmark_to_point(landmarks[down_idx], image_w, image_h)
    left = landmark_to_point(landmarks[left_idx], image_w, image_h)
    right = landmark_to_point(landmarks[right_idx], image_w, image_h)

    vert = euclidean(up, down)
    hor = euclidean(left, right)

    return 0.0 if hor == 0 else vert / hor

# -----------------------------
# Camera
# -----------------------------
camera = cv2.VideoCapture(0)

def generate_frames():

    global sleep_percentage
    global sleep_status

    while True:

        success, frame = camera.read()

        if not success:
            break

        h, w = frame.shape[:2]

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        results = face_mesh.process(rgb)

        if results.multi_face_landmarks:

            landmarks = results.multi_face_landmarks[0].landmark

            l_ratio = compute_eye_ratio(
                landmarks, w, h,
                L_EYE_UP, L_EYE_DOWN,
                L_EYE_LEFT, L_EYE_RIGHT
            )

            r_ratio = compute_eye_ratio(
                landmarks, w, h,
                R_EYE_UP, R_EYE_DOWN,
                R_EYE_LEFT, R_EYE_RIGHT
            )

            eye_ratio = (l_ratio + r_ratio) / 2

            sleep_percentage = min(int((eye_ratio / 0.30) * 100), 100)

            if sleep_percentage < 60:
                sleep_status = "SLEEP DETECTED"
                color = (0, 0, 255)
            else:
                sleep_status = "ACTIVE"
                color = (0, 255, 0)

            cv2.putText(
                frame,
                f"{sleep_status}",
                (30, 50),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                color,
                3
            )

            cv2.putText(
                frame,
                f"Eye Ratio: {eye_ratio:.2f}",
                (30, 100),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                (255,255,255),
                2
            )

            cv2.putText(
                frame,
                f"Alertness: {sleep_percentage}%",
                (30, 150),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                (0,255,255),
                2
            )

        ret, buffer = cv2.imencode('.jpg', frame)

        frame = buffer.tobytes()

        yield (
            b'--frame\r\n'
            b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n'
        )

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/video')
def video():
    return Response(
        generate_frames(),
        mimetype='multipart/x-mixed-replace; boundary=frame'
    )

@app.route('/status')
def status():
    return jsonify({
        "percentage": sleep_percentage,
        "status": sleep_status
    })

if __name__ == "__main__":
    app.run(debug=True)
