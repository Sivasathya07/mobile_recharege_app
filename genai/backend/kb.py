# backend/kb.py
from typing import Dict, List

# Minimal mock DB — replace with real sources in production

DRUG_SYNONYMS: Dict[str, List[str]] = {
    "paracetamol": ["acetaminophen", "pcm"],
    "ibuprofen": ["advil", "motrin"],
    "amoxicillin": ["amox"],
    "aspirin": ["asa"],
    "warfarin": ["coumadin"],
}

# Pairwise interaction flags (unordered pairs -> description)
INTERACTIONS: Dict[frozenset, str] = {
    frozenset(["ibuprofen", "aspirin"]): "Increased bleeding risk (avoid chronic co‑use; consider gastroprotection).",
    frozenset(["warfarin", "amoxicillin"]): "Potential INR increase / bleeding risk; monitor closely or avoid.",
    frozenset(["warfarin", "aspirin"]): "Major bleeding risk; avoid unless clinically justified.",
}

# Age‑specific daily dosage ranges (very simplified demo values — not clinical!)
# units: mg/day unless noted; use conservative, round numbers for demo
DOSAGE_BY_AGE = {
    "paracetamol": [
        {"min_age": 0,   "max_age": 11, "min": 75,  "max": 60*15,  "unit": "mg/day", "note": "~10–15 mg/kg q4–6h, max 60 mg/kg/day (demo)."},
        {"min_age": 12,  "max_age": 150, "min": 500, "max": 3000,   "unit": "mg/day", "note": "Typical adult max 3g/day (demo)."},
    ],
    "ibuprofen": [
        {"min_age": 0,   "max_age": 11,  "min": 40,  "max": 40*10,  "unit": "mg/day", "note": "~10 mg/kg q6–8h, max 40 mg/kg/day (demo)."},
        {"min_age": 12,  "max_age": 150, "min": 200, "max": 1200,   "unit": "mg/day", "note": "OTC max 1.2g/day (demo)."},
    ],
    "amoxicillin": [
        {"min_age": 0,   "max_age": 11,  "min": 250, "max": 90*25,  "unit": "mg/day", "note": "20–90 mg/kg/day divided (demo)."},
        {"min_age": 12,  "max_age": 150, "min": 500, "max": 3000,   "unit": "mg/day", "note": "Common adult range 1–3g/day (demo)."},
    ],
    "aspirin": [
        {"min_age": 12,  "max_age": 150, "min": 75,  "max": 300,    "unit": "mg/day", "note": "Low‑dose antiplatelet range (demo)."},
    ],
    "warfarin": [
        {"min_age": 12,  "max_age": 150, "min": 1,   "max": 10,     "unit": "mg/day", "note": "Highly individualized; monitor INR (demo)."},
    ],
}

# Simple alternatives map (therapeutic class approximations for demo)
ALTERNATIVES = {
    "ibuprofen": ["paracetamol"],
    "aspirin": ["paracetamol"],
    "amoxicillin": ["azithromycin"],  # not in DB — will be suggested with caveat
    "warfarin": ["apixaban"],          # not in DB — for demo only
}

CANONICAL = set(DRUG_SYNONYMS.keys())


def canonicalize(name: str) -> str:
    n = name.strip().lower()
    if n in CANONICAL:
        return n
    for base, syns in DRUG_SYNONYMS.items():
        if n == base or n in syns:
            return base
    return n  # unknown stays as-is