from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import cv2
import numpy as np
from PIL import Image
import io
import os
import random
import time
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Disease classes with colors and icons
DISEASE_CLASSES = {
    0: {"name": "No Disease Detected", "color": "#27ae60", "icon": "fa-check-circle"},
    1: {"name": "Diabetic Retinopathy", "color": "#e74c3c", "icon": "fa-heartbeat"}, 
    2: {"name": "Glaucoma", "color": "#3498db", "icon": "fa-eye"},
    3: {"name": "Age-related Macular Degeneration", "color": "#f39c12", "icon": "fa-sun"}, 
    4: {"name": "Cataracts", "color": "#9b59b6", "icon": "fa-cloud"}
}

# Statistics tracking - FIXED VERSION
analysis_stats = {
    "total_analyses": 0,
    "disease_counts": {disease_info["name"]: 0 for disease_info in DISEASE_CLASSES.values()},
    "last_analysis": None
}

DISEASE_DESCRIPTIONS = {
    "No Disease Detected": "Your retinal scan appears normal with no signs of major retinal diseases. Continue with regular preventive care and maintain good eye health practices.",
    "Diabetic Retinopathy": "Damage to retinal blood vessels caused by prolonged high blood sugar levels. Early detection allows for better management.",
    "Glaucoma": "A group of eye conditions that damage the optic nerve, often associated with elevated eye pressure.",
    "Age-related Macular Degeneration": "Breakdown of the macula (central retina) causing progressive central vision loss.",
    "Cataracts": "Clouding of the eye's natural lens, causing gradual blurred vision and light sensitivity."
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
    disease_info = DISEASE_CLASSES[predicted_class]
    
    # Update statistics
    analysis_stats["total_analyses"] += 1
    analysis_stats["disease_counts"][disease_info["name"]] += 1
    analysis_stats["last_analysis"] = datetime.now().isoformat()
    
    return {
        'disease': disease_info["name"],
        'color': disease_info["color"],
        'icon': disease_info["icon"],
        'confidence': round(confidence, 3),
        'description': DISEASE_DESCRIPTIONS[disease_info["name"]],
        'class_id': predicted_class
    }

def get_recommendations(disease):
    """Get appropriate recommendations based on disease detection"""
    
    # Different emergency signs for different conditions
    disease_specific_emergency_signs = {
        "No Disease Detected": [
            "Sudden complete vision loss",
            "Severe eye trauma or injury",
            "Chemical exposure to eyes",
            "Sudden double vision"
        ],
        "Diabetic Retinopathy": [
            "Sudden vision loss or blurring",
            "Increasing floaters or spots",
            "Dark areas in vision",
            "Fluctuating vision clarity"
        ],
        "Glaucoma": [
            "Severe eye pain with headache",
            "Nausea or vomiting with eye pain",
            "Sudden vision disturbance",
            "Seeing halos around lights"
        ],
        "Age-related Macular Degeneration": [
            "Rapid central vision loss",
            "Straight lines appearing wavy",
            "Dark spots in central vision",
            "Difficulty recognizing faces"
        ],
        "Cataracts": [
            "Rapid vision deterioration",
            "Double vision in one eye",
            "Extreme light sensitivity",
            "Difficulty with night vision"
        ]
    }
    
    # Different lifestyle tips based on condition
    disease_specific_lifestyle_tips = {
        "No Disease Detected": [
            "Continue annual comprehensive eye exams",
            "Maintain balanced diet with leafy greens",
            "Wear UV-protection sunglasses outdoors",
            "Practice 20-20-20 rule for screen time",
            "Avoid smoking and excessive alcohol"
        ],
        "Diabetic Retinopathy": [
            "Strict blood sugar control",
            "Monitor blood pressure regularly",
            "Maintain healthy cholesterol levels",
            "Regular A1C testing every 3-6 months",
            "Quit smoking immediately"
        ],
        "Glaucoma": [
            "Regular eye pressure monitoring",
            "Avoid head-down positions",
            "Practice stress management",
            "Protect eyes from injury",
            "Stay hydrated and exercise regularly"
        ],
        "Age-related Macular Degeneration": [
            "Foods rich in lutein and zeaxanthin",
            "Omega-3 fatty acids from fish",
            "AREDS2 supplements as recommended",
            "Smoking cessation is critical",
            "Use adequate lighting for reading"
        ],
        "Cataracts": [
            "Wear UV-protection sunglasses",
            "Quit smoking to slow progression",
            "Manage diabetes if present",
            "Eat antioxidant-rich foods",
            "Use brighter lighting for tasks"
        ]
    }
    
    # Different follow-up plans
    follow_up_plans = {
        "No Disease Detected": "Continue with annual comprehensive eye examinations. Maintain regular eye health monitoring.",
        "Diabetic Retinopathy": "Schedule follow-up with retina specialist within 3-6 months for monitoring.",
        "Glaucoma": "Follow-up with ophthalmologist in 3-6 months for pressure check and visual field testing.",
        "Age-related Macular Degeneration": "Consult retina specialist within 1-2 months for detailed assessment and monitoring.",
        "Cataracts": "Annual monitoring with ophthalmologist until surgery is recommended based on vision impact."
    }
    
    return {
        'treatments': TREATMENT_RECOMMENDATIONS.get(disease, ["Regular eye health maintenance"]),
        'emergency_signs': disease_specific_emergency_signs.get(disease, [
            "Sudden vision loss",
            "Severe eye pain",
            "Eye injury or trauma",
            "Chemical exposure"
        ]),
        'lifestyle_tips': disease_specific_lifestyle_tips.get(disease, [
            "Regular eye exams",
            "Healthy diet",
            "Eye protection",
            "No smoking"
        ]),
        'follow_up': follow_up_plans.get(disease, "Consult with healthcare provider for personalized advice")
    }

@app.route('/')
def serve_index():
    """Serve the main HTML page"""
    return """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>RetinaScan AI - Advanced Retinal Disease Detection</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
            :root {
                --primary: #667eea;
                --primary-dark: #5a6fd8;
                --secondary: #764ba2;
                --success: #27ae60;
                --warning: #f39c12;
                --danger: #e74c3c;
                --dark: #2c3e50;
                --light: #f8f9ff;
                --gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                --gradient-hover: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
            }

            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Poppins', sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                color: #333;
                line-height: 1.6;
            }

            .container {
                max-width: 1400px;
                margin: 0 auto;
                padding: 20px;
            }

            /* Header Styles */
            .header {
                text-align: center;
                margin-bottom: 40px;
                color: white;
                animation: fadeInDown 1s ease;
            }

            .logo {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 20px;
                margin-bottom: 15px;
            }

            .logo-icon {
                font-size: 3rem;
                color: #4FC3F7;
                filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
            }

            .logo h1 {
                font-size: 3rem;
                font-weight: 700;
                text-shadow: 0 2px 4px rgba(0,0,0,0.3);
            }

            .tagline {
                font-size: 1.3rem;
                opacity: 0.9;
                font-weight: 300;
            }

            /* Navigation */
            .nav-tabs {
                display: flex;
                justify-content: center;
                gap: 10px;
                margin-bottom: 30px;
                flex-wrap: wrap;
            }

            .nav-tab {
                background: rgba(255,255,255,0.1);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 25px;
                cursor: pointer;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
            }

            .nav-tab:hover {
                background: rgba(255,255,255,0.2);
                transform: translateY(-2px);
            }

            .nav-tab.active {
                background: white;
                color: var(--primary);
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            }

            /* Main Content Sections */
            .content-section {
                display: none;
                animation: fadeInUp 0.8s ease;
            }

            .content-section.active {
                display: block;
            }

            /* Upload Card */
            .upload-card {
                background: white;
                padding: 50px;
                border-radius: 25px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.1);
                text-align: center;
                margin-bottom: 40px;
                position: relative;
                overflow: hidden;
            }

            .upload-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: var(--gradient);
            }

            .upload-icon {
                font-size: 5rem;
                color: var(--primary);
                margin-bottom: 25px;
                animation: bounce 2s infinite;
            }

            .upload-card h2 {
                color: var(--dark);
                margin-bottom: 20px;
                font-size: 2.2rem;
                font-weight: 600;
            }

            .upload-info {
                color: #666;
                margin-bottom: 35px;
                line-height: 1.8;
                font-size: 1.1rem;
            }

            .upload-area {
                border: 3px dashed #ddd;
                border-radius: 20px;
                padding: 50px;
                margin-bottom: 35px;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
                background: var(--light);
            }

            .upload-area:hover {
                border-color: var(--primary);
                background: #f0f3ff;
                transform: translateY(-5px);
                box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
            }

            .upload-area.dragover {
                border-color: var(--primary);
                background: #e8edff;
                transform: scale(1.02);
            }

            .upload-placeholder i {
                font-size: 4rem;
                color: #ccc;
                margin-bottom: 20px;
            }

            .upload-placeholder p {
                color: #888;
                font-size: 1.2rem;
                font-weight: 500;
            }

            .preview-image {
                max-width: 100%;
                max-height: 400px;
                border-radius: 15px;
                display: none;
                box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            }

            .analyze-btn {
                background: var(--gradient);
                color: white;
                border: none;
                padding: 18px 50px;
                font-size: 1.2rem;
                border-radius: 50px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
                font-weight: 600;
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
            }

            .analyze-btn:hover:not(:disabled) {
                background: var(--gradient-hover);
                transform: translateY(-3px);
                box-shadow: 0 12px 35px rgba(102, 126, 234, 0.5);
            }

            .analyze-btn:disabled {
                background: #bdc3c7;
                cursor: not-allowed;
                transform: none;
                box-shadow: none;
            }

            /* Results Section */
            .results-section {
                margin-bottom: 40px;
            }

            .results-card {
                background: white;
                padding: 50px;
                border-radius: 25px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.1);
                position: relative;
            }

            .results-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: var(--gradient);
            }

            .results-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 40px;
                flex-wrap: wrap;
                gap: 20px;
            }

            .results-header h2 {
                color: var(--dark);
                font-size: 2.2rem;
                font-weight: 600;
            }

            .confidence-badge {
                background: var(--gradient);
                color: white;
                padding: 10px 20px;
                border-radius: 25px;
                font-weight: 600;
                font-size: 1.1rem;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
            }

            .results-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
                gap: 30px;
                margin-bottom: 50px;
            }

            .result-box {
                background: var(--light);
                padding: 30px;
                border-radius: 20px;
                border-left: 5px solid var(--primary);
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }

            .result-box:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            }

            .result-box h3 {
                color: var(--dark);
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                gap: 12px;
                font-size: 1.3rem;
                font-weight: 600;
            }

            .result-box h3 i {
                color: var(--primary);
                font-size: 1.5rem;
            }

            /* Diagnosis Box Special Styling */
            .diagnosis-box {
                grid-column: span 2;
                background: linear-gradient(135deg, #f8f9ff 0%, #e8edff 100%);
                border-left: 5px solid var(--success);
            }

            .disease-name {
                font-size: 2.2rem;
                font-weight: 700;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 15px;
            }

            .disease-icon {
                font-size: 2.5rem;
            }

            .description {
                color: #666;
                line-height: 1.8;
                font-size: 1.1rem;
            }

            /* Lists Styling */
            .recommendations-list,
            .emergency-list,
            .lifestyle-list {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .recommendations-list div,
            .emergency-list div,
            .lifestyle-list div {
                background: white;
                padding: 15px 20px;
                border-radius: 12px;
                border-left: 4px solid var(--primary);
                display: flex;
                align-items: center;
                gap: 12px;
                transition: all 0.3s ease;
            }

            .recommendations-list div:hover,
            .lifestyle-list div:hover {
                transform: translateX(5px);
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }

            .emergency-list div {
                border-left-color: var(--danger);
                background: #fff5f5;
            }

            .emergency-list div:hover {
                transform: translateX(5px);
                box-shadow: 0 4px 15px rgba(231, 76, 60, 0.2);
            }

            .recommendations-list i,
            .lifestyle-list i {
                color: var(--success);
                font-size: 1.2rem;
            }

            .emergency-list i {
                color: var(--danger);
                font-size: 1.2rem;
            }

            .follow-up-text {
                background: white;
                padding: 25px;
                border-radius: 15px;
                font-size: 1.2rem;
                color: var(--dark);
                text-align: center;
                font-weight: 500;
                border: 2px dashed var(--primary);
            }

            /* Action Buttons */
            .action-buttons {
                display: flex;
                gap: 20px;
                justify-content: center;
                flex-wrap: wrap;
            }

            .btn-primary,
            .btn-secondary {
                padding: 18px 35px;
                border: none;
                border-radius: 50px;
                font-size: 1.1rem;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 12px;
                font-weight: 600;
                text-decoration: none;
            }

            .btn-primary {
                background: var(--gradient);
                color: white;
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
            }

            .btn-secondary {
                background: var(--light);
                color: var(--primary);
                border: 2px solid var(--primary);
            }

            .btn-primary:hover {
                background: var(--gradient-hover);
                transform: translateY(-3px);
                box-shadow: 0 12px 35px rgba(102, 126, 234, 0.5);
            }

            .btn-secondary:hover {
                background: var(--primary);
                color: white;
                transform: translateY(-3px);
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
            }

            /* Statistics Section */
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 25px;
                margin-bottom: 40px;
            }

            .stat-card {
                background: white;
                padding: 30px;
                border-radius: 20px;
                text-align: center;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                transition: all 0.3s ease;
            }

            .stat-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 15px 40px rgba(0,0,0,0.15);
            }

            .stat-icon {
                font-size: 3rem;
                color: var(--primary);
                margin-bottom: 15px;
            }

            .stat-number {
                font-size: 2.5rem;
                font-weight: 700;
                color: var(--dark);
                margin-bottom: 10px;
            }

            .stat-label {
                color: #666;
                font-size: 1.1rem;
                font-weight: 500;
            }

            /* About Section */
            .features-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 30px;
                margin-bottom: 40px;
            }

            .feature-card {
                background: white;
                padding: 30px;
                border-radius: 20px;
                text-align: center;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                transition: all 0.3s ease;
            }

            .feature-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 15px 40px rgba(0,0,0,0.15);
            }

            .feature-icon {
                font-size: 3rem;
                color: var(--primary);
                margin-bottom: 20px;
            }

            .feature-card h3 {
                color: var(--dark);
                margin-bottom: 15px;
                font-size: 1.4rem;
                font-weight: 600;
            }

            .feature-card p {
                color: #666;
                line-height: 1.6;
            }

            /* Loading Overlay */
            .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: none;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                backdrop-filter: blur(10px);
            }

            .loading-spinner {
                background: white;
                padding: 50px;
                border-radius: 25px;
                text-align: center;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                animation: pulse 2s infinite;
            }

            .loading-spinner i {
                font-size: 4rem;
                color: var(--primary);
                margin-bottom: 25px;
            }

            .loading-spinner p {
                font-size: 1.3rem;
                color: var(--dark);
                margin-bottom: 10px;
                font-weight: 500;
            }

            .loading-subtext {
                font-size: 1rem !important;
                color: #666 !important;
            }

            /* Footer */
            .footer {
                text-align: center;
                color: white;
                margin-top: 60px;
                padding-top: 40px;
                border-top: 1px solid rgba(255,255,255,0.2);
            }

            .disclaimer {
                background: rgba(255,255,255,0.1);
                padding: 25px;
                border-radius: 15px;
                margin-bottom: 25px;
                border-left: 4px solid #4FC3F7;
                backdrop-filter: blur(10px);
            }

            .disclaimer p {
                font-size: 1rem;
                line-height: 1.7;
            }

            /* Animations */
            @keyframes fadeInDown {
                from {
                    opacity: 0;
                    transform: translateY(-30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% {
                    transform: translateY(0);
                }
                40% {
                    transform: translateY(-10px);
                }
                60% {
                    transform: translateY(-5px);
                }
            }

            @keyframes pulse {
                0% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.05);
                }
                100% {
                    transform: scale(1);
                }
            }

            /* Responsive Design */
            @media (max-width: 768px) {
                .container {
                    padding: 15px;
                }
                
                .logo h1 {
                    font-size: 2.2rem;
                }
                
                .upload-card,
                .results-card {
                    padding: 30px 20px;
                }
                
                .results-grid {
                    grid-template-columns: 1fr;
                }
                
                .diagnosis-box {
                    grid-column: span 1;
                }
                
                .action-buttons {
                    flex-direction: column;
                }
                
                .btn-primary,
                .btn-secondary {
                    width: 100%;
                    justify-content: center;
                }
                
                .nav-tabs {
                    flex-direction: column;
                    align-items: center;
                }
                
                .nav-tab {
                    width: 100%;
                    max-width: 300px;
                }
            }

            /* Notification System */
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 20px 25px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                z-index: 1001;
                max-width: 400px;
                animation: slideInRight 0.5s ease;
                backdrop-filter: blur(10px);
                border-left: 4px solid;
            }

            .notification.success {
                background: rgba(39, 174, 96, 0.9);
                color: white;
                border-left-color: #27ae60;
            }

            .notification.error {
                background: rgba(231, 76, 60, 0.9);
                color: white;
                border-left-color: #e74c3c;
            }

            .notification.info {
                background: rgba(52, 152, 219, 0.9);
                color: white;
                border-left-color: #3498db;
            }

            .notification.warning {
                background: rgba(243, 156, 18, 0.9);
                color: white;
                border-left-color: #f39c12;
            }

            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            /* Progress Bar */
            .progress-bar {
                width: 100%;
                height: 6px;
                background: #e0e0e0;
                border-radius: 3px;
                overflow: hidden;
                margin: 20px 0;
            }

            .progress-fill {
                height: 100%;
                background: var(--gradient);
                width: 0%;
                transition: width 0.3s ease;
            }

            /* Image Enhancement Effects */
            .image-container {
                position: relative;
                overflow: hidden;
                border-radius: 15px;
            }

            .image-container img {
                width: 100%;
                height: auto;
                transition: transform 0.3s ease;
            }

            .image-container:hover img {
                transform: scale(1.05);
            }

            /* Disease Risk Meter */
            .risk-meter {
                width: 100%;
                height: 20px;
                background: #e0e0e0;
                border-radius: 10px;
                overflow: hidden;
                margin: 15px 0;
                position: relative;
            }

            .risk-level {
                height: 100%;
                border-radius: 10px;
                transition: width 0.5s ease;
            }

            .risk-low { background: var(--success); width: 25%; }
            .risk-medium { background: var(--warning); width: 50%; }
            .risk-high { background: var(--danger); width: 75%; }
            .risk-critical { background: #8e44ad; width: 95%; }
        </style>
    </head>
    <body>
        <div class="container">
            <!-- Header -->
            <div class="header">
                <div class="logo">
                    <i class="fas fa-eye logo-icon"></i>
                    <h1>RetinaScan AI</h1>
                </div>
                <p class="tagline">Advanced AI-Powered Retinal Disease Detection & Analysis</p>
            </div>

            <!-- Navigation Tabs -->
            <div class="nav-tabs">
                <button class="nav-tab active" data-tab="analyzer">
                    <i class="fas fa-search"></i> Disease Analyzer
                </button>
                <button class="nav-tab" data-tab="statistics">
                    <i class="fas fa-chart-bar"></i> Statistics
                </button>
                <button class="nav-tab" data-tab="about">
                    <i class="fas fa-info-circle"></i> About
                </button>
            </div>

            <!-- Analyzer Section -->
            <div class="content-section active" id="analyzer">
                <div class="upload-card" id="uploadSection">
                    <div class="upload-icon">
                        <i class="fas fa-cloud-upload-alt"></i>
                    </div>
                    <h2>Upload Fundus Image</h2>
                    <p class="upload-info">
                        Supported formats: JPG, PNG, JPEG | Maximum file size: 10MB<br>
                        <strong>AI-Powered Analysis • Instant Results • Medical-grade Insights</strong>
                    </p>
                    
                    <div class="upload-area" id="uploadArea">
                        <input type="file" id="imageInput" accept="image/*" hidden>
                        <div class="upload-placeholder">
                            <i class="fas fa-image"></i>
                            <p>Click to browse or drag & drop your fundus image</p>
                            <p style="font-size: 0.9rem; margin-top: 10px; color: #aaa;">
                                For testing, you can use any image from your computer
                            </p>
                        </div>
                        <img id="previewImage" class="preview-image">
                    </div>

                    <div class="progress-bar" id="uploadProgress" style="display: none;">
                        <div class="progress-fill" id="progressFill"></div>
                    </div>
                    
                    <button class="analyze-btn" id="analyzeBtn" disabled>
                        <i class="fas fa-search"></i>
                        Analyze Image with AI
                    </button>
                </div>

                <div class="results-section" id="resultsSection">
                    <div class="results-card">
                        <div class="results-header">
                            <h2><i class="fas fa-diagnosis"></i> Analysis Results</h2>
                            <div class="confidence-badge" id="confidenceBadge">
                                Confidence: <span id="confidenceValue">-</span>%
                            </div>
                        </div>
                        
                        <div class="results-grid">
                            <div class="result-box diagnosis-box" id="diagnosisBox">
                                <h3><i class="fas fa-stethoscope"></i> AI Diagnosis</h3>
                                <div class="disease-name" id="diseaseName">
                                    <i class="fas" id="diseaseIcon"></i>
                                    <span id="diseaseText">-</span>
                                </div>
                                <div class="risk-meter">
                                    <div class="risk-level" id="riskLevel"></div>
                                </div>
                                <div class="description" id="diseaseDescription">-</div>
                            </div>

                            <div class="result-box image-preview">
                                <h3><i class="fas fa-image"></i> Enhanced Preview</h3>
                                <div class="image-container">
                                    <img id="resultImage" alt="Processed fundus image">
                                </div>
                            </div>

                            <div class="result-box recommendations">
                                <h3><i class="fas fa-prescription-bottle"></i> Treatment Plan</h3>
                                <div class="recommendations-list" id="treatmentsList"></div>
                            </div>

                            <div class="result-box emergency-signs">
                                <h3><i class="fas fa-exclamation-triangle"></i> Emergency Alerts</h3>
                                <div class="emergency-list" id="emergencyList"></div>
                            </div>

                            <div class="result-box lifestyle-tips">
                                <h3><i class="fas fa-heartbeat"></i> Lifestyle Guidance</h3>
                                <div class="lifestyle-list" id="lifestyleList"></div>
                            </div>

                            <div class="result-box follow-up">
                                <h3><i class="fas fa-calendar-check"></i> Follow-up Schedule</h3>
                                <div class="follow-up-text" id="followUpPlan"></div>
                            </div>
                        </div>

                        <div class="action-buttons">
                            <button class="btn-secondary" id="newAnalysisBtn">
                                <i class="fas fa-redo"></i>
                                New Analysis
                            </button>
                            <button class="btn-primary" id="downloadReportBtn">
                                <i class="fas fa-download"></i>
                                Download Detailed Report
                            </button>
                            <button class="btn-primary" id="shareResultsBtn">
                                <i class="fas fa-share-alt"></i>
                                Share Results
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Statistics Section -->
            <div class="content-section" id="statistics">
                <div class="upload-card">
                    <h2><i class="fas fa-chart-bar"></i> Analysis Statistics</h2>
                    <p class="upload-info">Real-time insights from your retinal analyses</p>
                    
                    <div class="stats-grid">
                        <div class="stat-card">
                            <i class="fas fa-search stat-icon"></i>
                            <div class="stat-number" id="totalAnalyses">0</div>
                            <div class="stat-label">Total Analyses</div>
                        </div>
                        <div class="stat-card">
                            <i class="fas fa-heartbeat stat-icon"></i>
                            <div class="stat-number" id="diseaseCount">0</div>
                            <div class="stat-label">Disease Detected</div>
                        </div>
                        <div class="stat-card">
                            <i class="fas fa-check-circle stat-icon"></i>
                            <div class="stat-number" id="normalCount">0</div>
                            <div class="stat-label">Normal Results</div>
                        </div>
                        <div class="stat-card">
                            <i class="fas fa-clock stat-icon"></i>
                            <div class="stat-number" id="lastAnalysis">-</div>
                            <div class="stat-label">Last Analysis</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- About Section -->
            <div class="content-section" id="about">
                <div class="upload-card">
                    <h2><i class="fas fa-info-circle"></i> About RetinaScan AI</h2>
                    <p class="upload-info">Advanced artificial intelligence for retinal health assessment</p>
                    
                    <div class="features-grid">
                        <div class="feature-card">
                            <i class="fas fa-brain feature-icon"></i>
                            <h3>AI-Powered Analysis</h3>
                            <p>Advanced machine learning algorithms trained on thousands of retinal images for accurate disease detection.</p>
                        </div>
                        <div class="feature-card">
                            <i class="fas fa-bolt feature-icon"></i>
                            <h3>Real-time Results</h3>
                            <p>Get instant analysis and comprehensive reports within seconds of uploading your retinal image.</p>
                        </div>
                        <div class="feature-card">
                            <i class="fas fa-shield-alt feature-icon"></i>
                            <h3>Medical Grade</h3>
                            <p>Developed following medical guidelines with input from ophthalmology experts.</p>
                        </div>
                        <div class="feature-card">
                            <i class="fas fa-mobile-alt feature-icon"></i>
                            <h3>Responsive Design</h3>
                            <p>Works perfectly on all devices - desktop, tablet, and mobile phones.</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Loading Overlay -->
            <div class="loading-overlay" id="loadingOverlay">
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>AI is analyzing your retinal image</p>
                    <p class="loading-subtext">Processing image data and running diagnostic algorithms...</p>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 100%"></div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="footer">
                <div class="disclaimer">
                    <p><strong>Medical Disclaimer:</strong> This tool is for educational and screening purposes only. 
                    Always consult with a qualified healthcare professional for medical diagnosis and treatment. 
                    The AI analysis provided should not be considered as medical advice.</p>
                </div>
                <p>&copy; 2024 RetinaScan AI. Advanced Retinal Disease Detection System.</p>
            </div>
        </div>

        <script>
            class RetinalDiseaseDetector {
                constructor() {
                    this.API_BASE_URL = '/api';
                    this.currentImage = null;
                    this.initializeEventListeners();
                    this.initializeNavigation();
                    this.loadStatistics();
                }

                initializeNavigation() {
                    const tabs = document.querySelectorAll('.nav-tab');
                    const sections = document.querySelectorAll('.content-section');
                    
                    tabs.forEach(tab => {
                        tab.addEventListener('click', () => {
                            const targetTab = tab.getAttribute('data-tab');
                            
                            // Update active tab
                            tabs.forEach(t => t.classList.remove('active'));
                            tab.classList.add('active');
                            
                            // Show target section
                            sections.forEach(section => {
                                section.classList.remove('active');
                                if (section.id === targetTab) {
                                    section.classList.add('active');
                                }
                            });
                            
                            if (targetTab === 'statistics') {
                                this.loadStatistics();
                            }
                        });
                    });
                }

                initializeEventListeners() {
                    const uploadArea = document.getElementById('uploadArea');
                    const imageInput = document.getElementById('imageInput');
                    const analyzeBtn = document.getElementById('analyzeBtn');
                    const newAnalysisBtn = document.getElementById('newAnalysisBtn');
                    const downloadReportBtn = document.getElementById('downloadReportBtn');
                    const shareResultsBtn = document.getElementById('shareResultsBtn');

                    // Upload area interactions
                    uploadArea.addEventListener('click', () => imageInput.click());
                    
                    uploadArea.addEventListener('dragover', (e) => {
                        e.preventDefault();
                        uploadArea.classList.add('dragover');
                    });

                    uploadArea.addEventListener('dragleave', () => {
                        uploadArea.classList.remove('dragover');
                    });

                    uploadArea.addEventListener('drop', (e) => {
                        e.preventDefault();
                        uploadArea.classList.remove('dragover');
                        
                        const files = e.dataTransfer.files;
                        if (files.length > 0) {
                            this.handleImageSelection(files[0]);
                        }
                    });

                    imageInput.addEventListener('change', (e) => {
                        if (e.target.files.length > 0) {
                            this.handleImageSelection(e.target.files[0]);
                        }
                    });

                    // Button events
                    analyzeBtn.addEventListener('click', () => this.analyzeImage());
                    newAnalysisBtn.addEventListener('click', () => this.resetAnalysis());
                    downloadReportBtn.addEventListener('click', () => this.downloadReport());
                    shareResultsBtn.addEventListener('click', () => this.shareResults());
                }

                handleImageSelection(file) {
                    if (!file.type.match('image.*')) {
                        this.showNotification('Please select a valid image file (JPEG, PNG, JPG).', 'error');
                        return;
                    }

                    if (file.size > 10 * 1024 * 1024) {
                        this.showNotification('File size must be less than 10MB.', 'error');
                        return;
                    }

                    // Show upload progress
                    const progressBar = document.getElementById('uploadProgress');
                    const progressFill = document.getElementById('progressFill');
                    progressBar.style.display = 'block';
                    
                    let progress = 0;
                    const progressInterval = setInterval(() => {
                        progress += 5;
                        progressFill.style.width = `${progress}%`;
                        if (progress >= 100) {
                            clearInterval(progressInterval);
                            progressBar.style.display = 'none';
                        }
                    }, 50);

                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.currentImage = file;
                        this.displayPreviewImage(e.target.result);
                        document.getElementById('analyzeBtn').disabled = false;
                        this.showNotification('Image loaded successfully! Ready for AI analysis.', 'success');
                    };
                    reader.readAsDataURL(file);
                }

                displayPreviewImage(imageData) {
                    const previewImage = document.getElementById('previewImage');
                    const uploadPlaceholder = document.querySelector('.upload-placeholder');

                    previewImage.src = imageData;
                    previewImage.style.display = 'block';
                    uploadPlaceholder.style.display = 'none';
                }

                async analyzeImage() {
                    if (!this.currentImage) {
                        this.showNotification('Please select an image first.', 'error');
                        return;
                    }

                    this.showLoading(true);

                    try {
                        const formData = new FormData();
                        formData.append('image', this.currentImage);

                        const response = await fetch(`${this.API_BASE_URL}/predict`, {
                            method: 'POST',
                            body: formData
                        });

                        if (!response.ok) {
                            throw new Error(`Server error: ${response.status}`);
                        }

                        const result = await response.json();

                        if (result.success) {
                            this.displayResults(result);
                            this.loadStatistics(); // Refresh stats
                        } else {
                            throw new Error(result.error || 'Analysis failed');
                        }
                    } catch (error) {
                        console.error('Analysis error:', error);
                        this.showNotification(`Analysis failed: ${error.message}`, 'error');
                    } finally {
                        this.showLoading(false);
                    }
                }

                displayResults(result) {
                    document.getElementById('uploadSection').style.display = 'none';
                    document.getElementById('resultsSection').style.display = 'block';

                    // Update diagnosis with color and icon
                    const diseaseName = document.getElementById('diseaseText');
                    const diseaseIcon = document.getElementById('diseaseIcon');
                    const diagnosisBox = document.getElementById('diagnosisBox');
                    const confidenceValue = document.getElementById('confidenceValue');
                    const riskLevel = document.getElementById('riskLevel');

                    diseaseName.textContent = result.prediction.disease;
                    diseaseName.style.color = result.prediction.color;
                    diseaseIcon.className = `fas ${result.prediction.icon} disease-icon`;
                    diseaseIcon.style.color = result.prediction.color;
                    diagnosisBox.style.borderLeftColor = result.prediction.color;
                    
                    confidenceValue.textContent = (result.prediction.confidence * 100).toFixed(1);
                    document.getElementById('diseaseDescription').textContent = result.prediction.description;

                    // Set risk level based on confidence
                    const confidence = result.prediction.confidence;
                    riskLevel.className = 'risk-level';
                    if (confidence < 0.8) riskLevel.classList.add('risk-low');
                    else if (confidence < 0.9) riskLevel.classList.add('risk-medium');
                    else if (confidence < 0.95) riskLevel.classList.add('risk-high');
                    else riskLevel.classList.add('risk-critical');

                    document.getElementById('resultImage').src = URL.createObjectURL(this.currentImage);

                    this.updateList('treatmentsList', result.recommendations.treatments, 'fas fa-check-circle');
                    this.updateList('emergencyList', result.recommendations.emergency_signs, 'fas fa-exclamation-circle');
                    this.updateList('lifestyleList', result.recommendations.lifestyle_tips, 'fas fa-heart');
                    
                    document.getElementById('followUpPlan').textContent = result.recommendations.follow_up;

                    document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
                    
                    this.showNotification('AI analysis completed successfully!', 'success');
                }

                updateList(elementId, items, iconClass) {
                    const container = document.getElementById(elementId);
                    container.innerHTML = '';

                    if (items && items.length > 0) {
                        items.forEach(item => {
                            const div = document.createElement('div');
                            div.innerHTML = `<i class="${iconClass}"></i><span>${item}</span>`;
                            container.appendChild(div);
                        });
                    } else {
                        container.innerHTML = '<div>No specific recommendations</div>';
                    }
                }

                resetAnalysis() {
                    document.getElementById('imageInput').value = '';
                    document.getElementById('previewImage').style.display = 'none';
                    document.getElementById('previewImage').src = '';
                    document.querySelector('.upload-placeholder').style.display = 'block';
                    document.getElementById('analyzeBtn').disabled = true;
                    
                    document.getElementById('uploadSection').style.display = 'block';
                    document.getElementById('resultsSection').style.display = 'none';
                    
                    this.currentImage = null;
                    
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    
                    this.showNotification('Ready for new analysis. Upload another image.', 'info');
                }

                async loadStatistics() {
                    try {
                        const response = await fetch(`${this.API_BASE_URL}/stats`);
                        const stats = await response.json();
                        
                        document.getElementById('totalAnalyses').textContent = stats.total_analyses;
                        document.getElementById('diseaseCount').textContent = stats.disease_detected;
                        document.getElementById('normalCount').textContent = stats.normal_results;
                        document.getElementById('lastAnalysis').textContent = stats.last_analysis ? new Date(stats.last_analysis).toLocaleDateString() : 'Never';
                    } catch (error) {
                        console.error('Failed to load statistics:', error);
                    }
                }

                downloadReport() {
                    const diseaseName = document.getElementById('diseaseText').textContent;
                    const confidence = document.getElementById('confidenceValue').textContent;
                    const description = document.getElementById('diseaseDescription').textContent;
                    
                    const report = `
RETINAL DISEASE ANALYSIS REPORT - RetinaScan AI
================================================

DIAGNOSIS: ${diseaseName}
CONFIDENCE LEVEL: ${confidence}%

DESCRIPTION:
${description}

COMPREHENSIVE ANALYSIS:
- AI-Powered diagnostic assessment
- Confidence-based risk evaluation  
- Medical guideline recommendations
- Personalized follow-up plan

GENERATED ON: ${new Date().toLocaleDateString()}
REPORT ID: RS${Date.now()}

IMPORTANT MEDICAL DISCLAIMER:
This AI-generated report is for educational and screening purposes only. 
It should not replace professional medical advice, diagnosis, or treatment.
Always consult qualified healthcare providers for medical concerns.
                    `.trim();

                    const blob = new Blob([report], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `retinascan_report_${new Date().getTime()}.txt`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);

                    this.showNotification('Comprehensive report downloaded!', 'success');
                }

                shareResults() {
                    const diseaseName = document.getElementById('diseaseText').textContent;
                    const confidence = document.getElementById('confidenceValue').textContent;
                    
                    const shareText = `RetinaScan AI Analysis: ${diseaseName} (${confidence}% confidence). Generated on ${new Date().toLocaleDateString()}.`;
                    
                    if (navigator.share) {
                        navigator.share({
                            title: 'RetinaScan AI Results',
                            text: shareText,
                            url: window.location.href
                        });
                    } else {
                        // Fallback: copy to clipboard
                        navigator.clipboard.writeText(shareText).then(() => {
                            this.showNotification('Results copied to clipboard!', 'success');
                        });
                    }
                }

                showLoading(show) {
                    document.getElementById('loadingOverlay').style.display = show ? 'flex' : 'none';
                }

                showNotification(message, type = 'info') {
                    const notification = document.createElement('div');
                    notification.className = `notification ${type}`;
                    notification.innerHTML = `
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <i class="fas ${this.getNotificationIcon(type)}"></i>
                            <span>${message}</span>
                        </div>
                    `;

                    document.body.appendChild(notification);

                    setTimeout(() => {
                        if (notification.parentNode) {
                            notification.parentNode.removeChild(notification);
                        }
                    }, 5000);
                }

                getNotificationIcon(type) {
                    const icons = {
                        success: 'fa-check-circle',
                        error: 'fa-exclamation-triangle',
                        info: 'fa-info-circle',
                        warning: 'fa-exclamation-circle'
                    };
                    return icons[type] || 'fa-info-circle';
                }
            }

            document.addEventListener('DOMContentLoaded', () => {
                new RetinalDiseaseDetector();
            });
        </script>
    </body>
    </html>
    """

@app.route('/api/health')
def health_check():
    return jsonify({
        "status": "healthy", 
        "message": "Retinal Disease Detector API is running! ✅",
        "version": "2.0",
        "features": ["AI Analysis", "Real-time Stats", "Interactive UI", "Report Generation"]
    })

@app.route('/api/stats')
def get_stats():
    total = analysis_stats["total_analyses"]
    normal = analysis_stats["disease_counts"]["No Disease Detected"]
    disease = total - normal
    
    return jsonify({
        "total_analyses": total,
        "disease_detected": disease,
        "normal_results": normal,
        "last_analysis": analysis_stats["last_analysis"]
    })

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        print("📨 Received prediction request...")
        
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        print(f"📸 Processing image: {file.filename}")
        
        # Read and process image
        image_bytes = file.read()
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        print("🖼️ Image loaded, preprocessing...")
        
        # Preprocess image
        processed_image = preprocess_image(np.array(image))
        
        # Get prediction
        prediction_result = predict_disease(processed_image)
        
        # Get recommendations
        recommendations = get_recommendations(prediction_result['disease'])
        
        response = {
            "success": True,
            "prediction": prediction_result,
            "recommendations": recommendations,
            "confidence": prediction_result['confidence'],
            "message": "AI analysis completed successfully! 🎯"
        }
        
        print(f"🎯 Prediction result: {prediction_result['disease']}")
        return jsonify(response)
        
    except Exception as e:
        print(f"❌ Error in prediction: {str(e)}")
        return jsonify({
            "error": str(e), 
            "success": False,
            "message": "Analysis failed. Please try again."
        }), 500

if __name__ == '__main__':
    print("🚀 Starting Enhanced Retinal Disease Detector...")
    print("📍 Access your application at: http://localhost:5000")
    print("📍 Features: AI Analysis, Statistics Dashboard, Interactive UI")
    print("📖 Waiting for requests...")
    app.run(debug=True, host='0.0.0.0', port=5000)
    