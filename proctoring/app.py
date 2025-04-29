from flask import Flask, request, jsonify
from flask_cors import CORS
from io import BytesIO
import base64, cv2, numpy as np
from datetime import datetime
import os
import torch  # Load YOLOv5 model
import face_recognition
from flask_cors import cross_origin
import PyPDF2

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

# Load YOLOv5 model using PyTorch
model = torch.hub.load('ultralytics/yolov5', 'yolov5s')  # Load the small YOLOv5 model
model.conf = 0.4  # Confidence threshold


CAPTURE_DIR = "captures"
os.makedirs(CAPTURE_DIR, exist_ok=True)

# Load OpenCV's Haar cascade for face detection
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

@app.route("/proctor/upload", methods=["POST"])
def upload_image():
    try:
        data = request.json['image']
        encoded = data.split(",")[1]
        img_data = base64.b64decode(encoded)
        np_arr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.1, 4)

        if len(faces) == 0:
            return jsonify({"warning": "No face detected!"}), 200
        if len(faces) > 1:
            return jsonify({"warning": "Multiple faces detected. Please be alone in the frame."}), 200

        # Optional: check brightness or blurriness
        laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        if laplacian_var < 80:  # Threshold for blur detection
            return jsonify({"warning": "Face is too blurry or low lighting. Try again."}), 200

        # YOLOv5 device detection
        results = model(img)
        detected_devices = []
        for *box, conf, cls in results.xywh[0]:
            if conf > 0.4:
                label = model.names[int(cls)]
                if label in ["cell phone", "laptop", "tablet"]:
                    detected_devices.append(label)

        if detected_devices:
            return jsonify({
                "status": "Device detected",
                "devices": detected_devices,
                "action": "logout"
            }), 200

        # ✅ Save face image for future verification
        user_id = request.headers.get("Authorization", "").replace("Bearer ", "")
        if not user_id:
            return jsonify({"error": "User ID/token missing"}), 400

        filename = f"{CAPTURE_DIR}/{user_id}_registered.jpg"
        cv2.imwrite(filename, img)

        return jsonify({"success": True, "status": "Valid face detected. No external devices found."}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/proctor/detect-device", methods=["POST"])
def detect_device():
    try:
        data = request.json['image']
        encoded = data.split(",")[1]
        img_data = base64.b64decode(encoded)
        np_arr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        # Save input image for debugging
        cv2.imwrite("input_image_debug.jpg", img)

        # Resize and normalize image
        img_resized = cv2.resize(img, (640, 640))
        img_resized = img_resized / 255.0  # Normalize

        # Save resized image for debugging
        cv2.imwrite("resized_image_debug.jpg", img_resized * 255)

        # Perform YOLO object detection
        results = model(img_resized)

        # Log the detected objects for debugging
        print("Detected objects:")
        print(results.pandas().xyxy[0])  # Pandas DataFrame with detection results

        # Extract detected classes and confidence scores
        detected_devices = []
        detections = results.pandas().xyxy[0]  # Use pandas output
        for _, row in detections.iterrows():
            print(f"Detected: {row['name']} with confidence {row['confidence']}")  # Debugging log
            if row['confidence'] > 0.2 and row['name'] in ["cell phone", "laptop", "tablet"]:  # Lower threshold for testing
                detected_devices.append(row['name'])

        if detected_devices:
            return jsonify({
                "status": "Device detected",
                "devices": detected_devices,
                "action": "logout",
            }), 200

        return jsonify({"status": "No device detected"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/save-selfie', methods=['POST'])
def save_selfie():
    data = request.get_json()
    image_data = data['image']
    user_id = data['userId']

    try:
        img_bytes = base64.b64decode(image_data.split(",")[1])
        with open(f"faces/{user_id}.jpg", "wb") as f:
            f.write(img_bytes)
        return jsonify({"status": "saved"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/proctor/tab-warning", methods=["POST"])
def tab_warning():
    data = request.json
    print("Tab violation:", data)
    return jsonify({"status": "Tab switch logged"}), 200

@app.route('/compare-face', methods=['POST'])
@cross_origin(origin='http://localhost:3000') 
def compare_face():
    try:
        data = request.get_json()
        image_data = data.get('image')
        user_id = data.get('userId')

        if not image_data or not user_id:
            return jsonify({'match': False, 'error': 'Missing image or userId'}), 400

        stored_path = f'faces/{user_id}.jpg'
        if not os.path.exists(stored_path):
            return jsonify({'match': False, 'error': 'Reference image not found'}), 404

        # Load and encode stored selfie
        stored_image = face_recognition.load_image_file(stored_path)
        stored_encodings = face_recognition.face_encodings(stored_image)
        if not stored_encodings:
            return jsonify({'match': False, 'error': 'No face in reference image'}), 400

        # Load and encode current image
        current_image = face_recognition.load_image_file(BytesIO(base64.b64decode(image_data.split(",")[1])))
        current_encodings = face_recognition.face_encodings(current_image)
        if not current_encodings:
            return jsonify({'match': False, 'error': 'No face in current image'}), 400

        # Compare the faces
        match = face_recognition.compare_faces([stored_encodings[0]], current_encodings[0])[0]

        return jsonify({'match': match}), 200

    except Exception as e:
        return jsonify({'match': False, 'error': str(e)}), 500

ROLE_KEYWORDS = {
    "Frontend Developer": [
        "react", "javascript", "typescript", "css", "html", "redux", "tailwind", "ui/ux", "responsive design",
        "frontend", "material ui", "bootstrap", "figma", "webpack", "vite", "accessibility"
    ],
    "Backend Developer": [
        "node", "express", "mongodb", "sql", "api", "authentication", "jwt", "restful", "microservices",
        "docker", "kubernetes", "redis", "backend", "scalability", "spring boot"
    ],
    "Data Scientist": [
        "python", "pandas", "numpy", "machine learning", "sklearn", "regression", "classification",
        "data analysis", "data visualization", "matplotlib", "seaborn", "deep learning", "tensorflow",
        "nlp", "model evaluation", "data preprocessing"
    ],
    "Full Stack Developer": [
        "react", "node", "mongodb", "express", "fullstack", "api", "jwt", "typescript", "docker", "ci/cd",
        "agile", "graphql", "rest api", "integration", "testing", "unit test", "microservices"
    ]
}

# Extra resume strength criteria (applies to all roles)
COMMON_KEYWORDS = [
    "projects", "technical skills", "problem solving", "certifications", "achievements",
    "leadership", "team player", "collaboration", "project management", "communication", "github"
]

def extract_text_from_pdf(file_stream):
    reader = PyPDF2.PdfReader(file_stream)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text.lower()

@app.route('/score-resume', methods=['POST'])
def score_resume():
    role = request.form.get('role', '').lower()
    pdf_file = request.files.get('resume')

    if not role or not pdf_file:
        return jsonify({"error": "Role and resume required"}), 400

    text = extract_text_from_pdf(pdf_file.stream)

    role_keywords = ROLE_KEYWORDS.get(role, [])
    total_keywords = role_keywords + COMMON_KEYWORDS

    matched_keywords = [kw for kw in total_keywords if kw in text]
    score = int((len(matched_keywords) / len(total_keywords)) * 100)

    suggestion = "✅ Great resume! You're good to go." if score > 60 else "⚠️ Consider updating your resume with more relevant skills, projects, and keywords."

    return jsonify({
        "score": score,
        "matched_keywords": matched_keywords,
        "total_keywords": len(total_keywords),
        "suggestion": suggestion
    })


if __name__ == "__main__":
    app.run(debug=True)
