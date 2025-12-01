## backend/main.py (FastAPI server)
#```python
# backend/main.py
from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
from backend. logic import extract_drugs, analyze
from logic import extract_drugs, analyze


app = FastAPI(title="AI Rx Verifier", version="0.1.0")

class ExtractRequest(BaseModel):
    text: str = Field("", description="Unstructured prescription text")

class ExtractResponse(BaseModel):
    items: List[Dict[str, Any]]

class Item(BaseModel):
    name: str
    dose: float
    unit: str = "mg"
    freq_per_day: int = 1

class AnalyzeRequest(BaseModel):
    age: int
    text: Optional[str] = ""
    items: Optional[List[Item]] = None

@app.get("/health")
async def health():
    return {"ok": True}

@app.post("/extract", response_model=ExtractResponse)
async def extract(req: ExtractRequest):
    items = extract_drugs(req.text)
    return {"items": items}

@app.post("/analyze")
async def analyze_route(req: AnalyzeRequest):
    items = None
    if req.items:
        # Convert pydantic Items to dicts with daily mg
        items = []
        for it in req.items:
            items.append({
                "raw_name": it.name,
                "name": it.name.lower(),
                "dose": it.dose,
                "unit": it.unit,
                "freq_per_day": it.freq_per_day,
                "daily_mg": it.dose * (1000 if it.unit.lower()=="g" else 1) * it.freq_per_day,
            })
    result = analyze(req.age, text=req.text or "", items=items)
    return result

# --- Optional: plug in Hugging Face or watsonx ---
# 1) In logic.extract_drugs, call a HF pipeline to perform NER and slot-filling, then fallback to regex
# 2) Add a /rag endpoint that queries watsonx Discovery or a vector DB for label updates

# Run: uvicorn backend.main:app --reload --port 8000