import numpy as np
import random

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

EMERGENCY_SIGNS = {
    "Diabetic Retinopathy": [
        "Sudden vision loss",
        "Floaters or spots in vision",
        "Blurred or distorted vision",
        "Dark or empty areas in vision"
    ],
    "Glaucoma": [
        "Severe eye pain",
        "Headache with nausea",
        "Sudden vision disturbance",
        "Seeing halos around lights"
    ],
    "Age-related Macular Degeneration": [
        "Rapid central vision loss",
        "Distorted straight lines",
        "Dark spots in central vision"
    ],
    "Cataracts": [
        "Rapid vision deterioration",
        "Double vision in one eye",
        "Difficulty with night vision"
    ]
}

def predict_disease(image, model):
    """
    Predict retinal disease from processed image
    In a real scenario, this would use the actual trained model
    """
    # Placeholder prediction - replace with actual model inference
    if model is not None:
        # Real model prediction would go here
        predictions = model.predict(np.expand_dims(image, axis=0))
        predicted_class = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_class])
    else:
        # Mock prediction for demo
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
    """Get treatment recommendations and emergency signs for detected disease"""
    return {
        'treatments': TREATMENT_RECOMMENDATIONS.get(disease, []),
        'emergency_signs': EMERGENCY_SIGNS.get(disease, []),
        'lifestyle_tips': get_lifestyle_tips(disease),
        'follow_up': get_follow_up_plan(disease)
    }

def get_lifestyle_tips(disease):
    """Get lifestyle recommendations based on disease"""
    tips = {
        "General": [
            "Regular exercise",
            "Balanced diet rich in fruits and vegetables",
            "Adequate hydration",
            "No smoking",
            "Limited alcohol consumption"
        ]
    }
    
    specific_tips = {
        "Diabetic Retinopathy": [
            "Strict blood sugar control",
            "Monitor blood pressure",
            "Maintain healthy cholesterol levels",
            "Regular A1C testing"
        ],
        "Glaucoma": [
            "Avoid head-down positions",
            "Practice stress management",
            "Regular eye pressure checks",
            "Protect eyes from injury"
        ],
        "Age-related Macular Degeneration": [
            "Foods rich in lutein and zeaxanthin",
            "Omega-3 fatty acids",
            "Smoking cessation",
            "UV protection"
        ],
        "Cataracts": [
            "UV protection sunglasses",
            "Quit smoking",
            "Manage other health conditions",
            "Good lighting for reading"
        ]
    }
    
    return tips["General"] + specific_tips.get(disease, [])

def get_follow_up_plan(disease):
    """Get follow-up plan based on disease severity"""
    plans = {
        "No Disease Detected": "Annual comprehensive eye exam",
        "Diabetic Retinopathy": "3-6 month follow-up with retina specialist",
        "Glaucoma": "3-6 month pressure monitoring",
        "Age-related Macular Degeneration": "6 month follow-up with retina specialist",
        "Cataracts": "Annual monitoring until surgery recommended"
    }
    return plans.get(disease, "Consult with ophthalmologist")