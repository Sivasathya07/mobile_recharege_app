from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import cv2
import numpy as np
from PIL import Image
import io
import os
import random

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

# Disease classes
DISEASE_CLASSES = {
    0: "No Disease Detected",
    1: "Diabetic Retinopathy", 
    2: "Glaucoma",
    3: "Age-related Macular Degeneration",
    4: "Cataracts"
}

DISEASE_DESCRIPTIONS = {
    "No Disease Detected": "Your retinal scan appears normal. Continue regular eye checkups.",
    "Diabetic Retinopathy": "Damage to retinal blood vessels caused by diabetes.",
    "Glaucoma": "A group of eye conditions that damage the optic nerve.",
    "Age-related Macular Degeneration": "Breakdown of the macula causing central vision loss.",
    "Cataracts": "Clouding of the eye's natural lens, causing blurred vision."
}

TREATMENT_RECOMMENDATIONS = {
    "No Disease Detected": [
        "Annual comprehensive eye examination",
        "Maintain healthy diet rich in antioxidants",
        "Wear UV-protection sunglasses",
        "Practice good screen hygiene"
    ],
    "Diabetic Retinopathy": [
        "Control blood sugar levels strictly",
        "Regular monitoring by ophthalmologist", 
        "Laser treatment (photocoagulation)",
        "Anti-VEGF injections for swelling",
        "Vitrectomy in advanced cases"
    ],
    "Glaucoma": [
        "Prescription eye drops to reduce pressure",
        "Oral medications",
        "Laser therapy (trabeculoplasty)",
        "Microsurgery (trabeculectomy)",
        "Regular monitoring of eye pressure"
    ],
    "Age-related Macular Degeneration": [
        "AREDS2 supplements (vitamins C, E, zinc, copper)",
        "Anti-VEGF injections",
        "Laser photocoagulation", 
        "Low vision aids and rehabilitation",
        "Diet rich in leafy greens and fish"
    ],
    "Cataracts": [
        "Stronger glasses or magnifying lenses",
        "Brighter lighting for reading",
        "Cataract surgery with lens implant",
        "UV protection sunglasses",
        "Regular monitoring for progression"
    ]
}

def preprocess_image(image_array, target_size=(224, 224)):
    """Preprocess the fundus image"""
    if len(image_array.shape) == 2:  # Grayscale
        image_array = cv2.cvtColor(image_array, cv2.COLOR_GRAY2RGB)
    elif image_array.shape[2] == 4:  # RGBA
        image_array = cv2.cvtColor(image_array, cv2.COLOR_RGBA2RGB)
    
    image_array = cv2.resize(image_array, target_size)
    image_array = image_array.astype(np.float32) / 255.0
    
    return image_array

def predict_disease(image):
    """Mock prediction - replace with actual model"""
    predicted_class = random.randint(0, 4)
    confidence = random.uniform(0.7, 0.95)
    disease_name = DISEASE_CLASSES[predicted_class]
    
    return {
        'disease': disease_name,
        'confidence': round(confidence, 3),
        'description': DISEASE_DESCRIPTIONS[disease_name],
        'class_id': predicted_class
    }

def get_recommendations(disease):
    """Get treatment recommendations"""
    return {
        'treatments': TREATMENT_RECOMMENDATIONS.get(disease, []),
        'emergency_signs': [
            "Sudden vision loss",
            "Severe eye pain", 
            "Floaters or flashes",
            "Distorted vision"
        ],
        'lifestyle_tips': [
            "Regular exercise",
            "Balanced diet",
            "No smoking",
            "UV protection"
        ],
        'follow_up': "Consult with ophthalmologist for detailed examination"
    }

@app.route('/')
def serve_frontend():
    return app.send_static_file('index.html')

@app.route('/api/health')
def health_check():
    return jsonify({"status": "healthy", "message": "API is working! ✅"})

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        # Read and process image
        image_bytes = file.read()
        image = Image.open(io.BytesIO(image_bytes))
        
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        processed_image = preprocess_image(np.array(image))
        prediction_result = predict_disease(processed_image)
        recommendations = get_recommendations(prediction_result['disease'])
        
        response = {
            "success": True,
            "prediction": prediction_result,
            "recommendations": recommendations,
            "confidence": prediction_result['confidence']
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({"error": str(e), "success": False}), 500

if __name__ == '__main__':
    print("🚀 Starting Retinal Disease Detector...")
    print("📍 Access at: http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)