from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models.drug_ner import extract_drugs
from models.interactions import check_interactions
from backend.services import ibm_services
from backend.services import analyze_with_watson
from backend.services import item_services 
import json
from typing import List, Dict
app = FastAPI(title="Medical Prescription Verifier API")
# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
) 
# Load mock drug database
with open('../data/drug_db.json') as f:
    DRUG_DB = json.load(f)
@app.post("/analyze-prescription")
async def analyze_prescription(prescription: str, age: int = None):
    try:
        # Step 1: Extract drug entities
        drugs = extract_drugs(prescription)
        
        if not drugs:
            return {"error": "No drugs identified in prescription"}
        
        # Step 2: Check interactions
        interaction_results = check_interactions(drugs)
        
        # Step 3: Get IBM Watson insights
        watson_analysis = analyze_with_watson(prescription)
        
        # Step 4: Age-specific recommendations
        recommendations = []
        if age:
            for drug in drugs:
                drug_info = DRUG_DB.get(drug.lower(), {})
                if 'age_dosage' in drug_info:
                    recommendations.append({
                        'drug': drug,
                        'recommended_dosage': drug_info['age_dosage'].get(str(age), "Standard dosage")
                    })
        
        return {
            "drugs": drugs,
            "interactions": interaction_results,
            "watson_analysis": watson_analysis,
            "recommendations": recommendations
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/drug-alternatives/{drug_name}")
async def get_alternatives(drug_name: str, age: int = None):
    try:
        alternatives = []
        if drug_name.lower() in DRUG_DB:
            main_drug = DRUG_DB[drug_name.lower()]
            alternatives = main_drug.get('alternatives', [])
            
            if age:
                alternatives = [alt for alt in alternatives 
                               if age >= alt.get('min_age', 0) and age <= alt.get('max_age', 120)]
        
        return {"alternatives": alternatives}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

