from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from drug_data import check_interactions, get_dosage, get_alternatives
from fastapi.middleware.cors import CORSMiddleware
import pytesseract
from PIL import Image
import re
import os

# Set Tesseract executable path
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

app = FastAPI()

# Enable CORS to allow Streamlit frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8501"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    drugs: List[str]
    age: int
    text: Optional[str] = None

class VoiceAnalyzeRequest(BaseModel):
    transcript: str
    age: int

# Existing endpoint for manual drug input
@app.post("/analyze")
async def analyze(request: AnalyzeRequest):
    interactions = check_interactions(request.drugs)
    dosages = [f"{drug}: {get_dosage(drug, request.age)}" for drug in request.drugs]
    alternatives_list = [f"{drug}: {', '.join(get_alternatives(drug))}" for drug in request.drugs]
    extracted_info = []  # Placeholder for NLP logic if implemented
    return {
        "interactions": interactions,
        "dosages": dosages,
        "alternatives": alternatives_list,
        "extracted_info": extracted_info
    }

# Endpoint for image upload and OCR
@app.post("/upload-analyze")
async def upload_analyze(file: UploadFile = File(...), age: int = 30):
    try:
        # Save uploaded image temporarily
        temp_path = os.path.join(os.getcwd(), "temp_image.png")
        with open(temp_path, "wb") as buffer:
            buffer.write(await file.read())
        # Perform OCR
        image = Image.open(temp_path)
        text = pytesseract.image_to_string(image)
        # Extract drug names (simple regex; improve as needed)
        drug_pattern = r'\b(?:aspirin|ibuprofen|warfarin|acetaminophen|naproxen)\b'
        drugs = re.findall(drug_pattern, text.lower())
        if not drugs:
            raise HTTPException(status_code=400, detail="No recognizable drugs found in the image.")
        # Process the extracted drugs
        interactions = check_interactions(drugs)
        dosages = [f"{drug}: {get_dosage(drug, age)}" for drug in drugs]
        alternatives_list = [f"{drug}: {', '.join(get_alternatives(drug))}" for drug in drugs]
        extracted_info = []  # Placeholder
        return {
            "interactions": interactions,
            "dosages": dosages,
            "alternatives": alternatives_list,
            "extracted_info": extracted_info,
            "extracted_text": text
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

# Endpoint for voice input
@app.post("/voice-analyze")
async def voice_analyze(request: VoiceAnalyzeRequest):
    # Split transcript into potential drugs (simple split; improve parsing as needed)
    drugs = [drug.strip() for drug in request.transcript.lower().split() if any(drug.lower() in ["aspirin", "ibuprofen", "warfarin", "acetaminophen", "naproxen"] for drug in drug.split())]
    if not drugs:
        raise HTTPException(status_code=400, detail="No recognizable drugs in voice input.")
    interactions = check_interactions(drugs)
    dosages = [f"{drug}: {get_dosage(drug, request.age)}" for drug in drugs]
    alternatives_list = [f"{drug}: {', '.join(get_alternatives(drug))}" for drug in drugs]
    extracted_info = []  # Placeholder
    return {
        "interactions": interactions,
        "dosages": dosages,
        "alternatives": alternatives_list,
        "extracted_info": extracted_info,
        "transcript": request.transcript
    }