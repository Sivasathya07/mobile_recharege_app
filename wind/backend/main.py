from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import re
from datetime import datetime
import logging

# Optional: Hugging Face Transformers
try:
    from transformers import pipeline
except ImportError:
    pipeline = None
    logging.warning("transformers not installed. Drug extraction will be disabled.")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="AI Medical Prescription Verification API", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Try loading NLP models
drug_ner = None
medical_classifier = None
if pipeline:
    try:
        drug_ner = pipeline("ner", model="d4data/biomedical-ner-all", aggregation_strategy="simple")
        medical_classifier = pipeline(
            "text-classification",
            model="microsoft/BiomedNLP-PubMedBERT-base-uncased-abstract-fulltext"
        )
        logger.info("NLP models loaded successfully")
    except Exception as e:
        logger.error(f"Could not load NLP models: {e}")

# ----------------- Data Models -----------------
class DrugInfo(BaseModel):
    name: str
    dosage: str
    frequency: str
    route: Optional[str] = "oral"

class PatientInfo(BaseModel):
    age: int
    weight: Optional[float] = None
    medical_conditions: Optional[List[str]] = []
    allergies: Optional[List[str]] = []

class PrescriptionRequest(BaseModel):
    drugs: List[DrugInfo]
    patient: PatientInfo
    prescription_text: Optional[str] = None

class InteractionResult(BaseModel):
    severity: str
    description: str
    recommendation: str

class DosageRecommendation(BaseModel):
    drug_name: str
    recommended_dosage: str
    frequency: str
    notes: str

class AlternativeDrug(BaseModel):
    name: str
    reason: str
    dosage: str
    safety_score: float

# ----------------- Mock Drug Database -----------------
DRUG_DATABASE = {
    "aspirin": {
        "interactions": ["warfarin", "methotrexate", "lithium"],
        "age_dosage": {
            "child": "10-15mg/kg",
            "adult": "325-650mg",
            "elderly": "81-325mg"
        },
        "contraindications": ["bleeding disorders", "peptic ulcer"],
        "alternatives": ["ibuprofen", "acetaminophen"]
    },
    "warfarin": {
        "interactions": ["aspirin", "amiodarone", "phenytoin"],
        "age_dosage": {
            "adult": "2-10mg daily",
            "elderly": "1-5mg daily"
        },
        "contraindications": ["pregnancy", "active bleeding"],
        "alternatives": ["rivaroxaban", "apixaban"]
    }
}

# ----------------- Helper Functions -----------------
def extract_drugs_from_text(text: str):
    """Extract drugs, dosages, and frequencies from free text."""
    if not drug_ner:
        return []
    try:
        entities = drug_ner(text)
        drug_names = [e['word'] for e in entities if e['entity_group'] in ['DRUG', 'CHEMICAL']]
        dosage_pattern = r'(\d+(?:\.\d+)?)\s*(mg|g|ml|mcg|units?)'
        frequency_pattern = r'(once|twice|three times|\d+\s*times?)\s*(daily|per day|a day|bid|tid|qid)'
        dosages = re.findall(dosage_pattern, text, re.IGNORECASE)
        freqs = re.findall(frequency_pattern, text, re.IGNORECASE)

        results = []
        for i, drug in enumerate(drug_names):
            results.append({
                "name": drug.lower(),
                "dosage": f"{dosages[i][0]}{dosages[i][1]}" if i < len(dosages) else "Not specified",
                "frequency": f"{freqs[i][0]} {freqs[i][1]}" if i < len(freqs) else "Not specified"
            })
        return results
    except Exception as e:
        logger.error(f"Extraction error: {e}")
        return []

def check_drug_interactions(drugs: List[str]):
    interactions = []
    for i, d1 in enumerate(drugs):
        for d2 in drugs[i+1:]:
            if d1.lower() in DRUG_DATABASE and d2.lower() in DRUG_DATABASE[d1.lower()]["interactions"]:
                interactions.append(InteractionResult(
                    severity="High" if "warfarin" in [d1.lower(), d2.lower()] else "Moderate",
                    description=f"Interaction between {d1} and {d2}",
                    recommendation="Monitor patient closely or adjust medication"
                ))
    return interactions

def get_age_dosage(drug: str, age: int):
    if drug.lower() not in DRUG_DATABASE:
        return DosageRecommendation(drug_name=drug, recommended_dosage="Consult physician",
                                    frequency="As prescribed", notes="Not in database")
    category = "child" if age < 18 else "elderly" if age >= 65 else "adult"
    dosage = DRUG_DATABASE[drug.lower()]["age_dosage"].get(category, "Consult physician")
    notes = "Elderly patients may require lower doses" if category == "elderly" else ""
    return DosageRecommendation(drug_name=drug, recommended_dosage=dosage,
                                 frequency="As prescribed by physician", notes=notes)

def suggest_alternatives(drug: str, conditions: List[str]):
    if drug.lower() not in DRUG_DATABASE:
        return []
    contraindications = DRUG_DATABASE[drug.lower()]["contraindications"]
    has_contra = any(c.lower() in [ci.lower() for ci in contraindications] for c in conditions)
    return [
        AlternativeDrug(name=alt, reason="Safer alternative" if has_contra else "Equivalent medication",
                        dosage="Consult physician", safety_score=0.9)
        for alt in DRUG_DATABASE[drug.lower()]["alternatives"]
    ]

# ----------------- API Routes -----------------
@app.get("/")
async def root():
    return {"message": "AI Medical Prescription Verification API", "version": "1.0.0"}

@app.post("/analyze_prescription")
async def analyze_prescription(req: PrescriptionRequest):
    results = {
        "interactions": [],
        "dosage_recommendations": [],
        "alternatives": [],
        "extracted_drugs": [],
        "safety_score": 1.0,
        "timestamp": datetime.now().isoformat()
    }
    if req.prescription_text:
        results["extracted_drugs"] = extract_drugs_from_text(req.prescription_text)
    drug_names = [d.name for d in req.drugs]
    interactions = check_drug_interactions(drug_names)
    results["interactions"] = [i.dict() for i in interactions]
    for d in req.drugs:
        results["dosage_recommendations"].append(get_age_dosage(d.name, req.patient.age).dict())
    for d in req.drugs:
        results["alternatives"].extend([a.dict() for a in suggest_alternatives(d.name, req.patient.medical_conditions)])
    score = 1.0 - (0.3 * len([i for i in interactions if i.severity == "High"]) +
                   0.1 * len([i for i in interactions if i.severity == "Moderate"]))
    results["safety_score"] = max(0, score)
    return results

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "models_loaded": drug_ner is not None and medical_classifier is not None
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
