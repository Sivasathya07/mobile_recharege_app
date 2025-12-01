## backend/logic.py (core logic)
#```python
# backend/logic.py
from typing import List, Dict, Any
import re
from backend.kb import INTERACTIONS, DOSAGE_BY_AGE, ALTERNATIVES, canonicalize

# --- Extraction ---

EXTRACT_PATTERN = re.compile(
    r"""
    (?P<name>[A-Za-z][A-Za-z\- ]+)\s*
    (?P<dose>\d{1,4})\s*(?P<unit>mg|g|mcg|µg)?\s*
    (?:(?P<freq>once|twice|thrice|\d+x|every\s*\d+\s*(?:h|hours)|q\d+h))?
    """,
    re.IGNORECASE | re.VERBOSE,
)

FREQ_MAP = {
    "once": 1,
    "twice": 2,
    "thrice": 3,
}


def parse_frequency(freq: str) -> int:
    if not freq:
        return 1
    f = freq.lower().strip()
    if f in FREQ_MAP:
        return FREQ_MAP[f]
    if f.endswith("x") and f[:-1].isdigit():
        return int(f[:-1])
    m = re.match(r"every\s*(\d+)\s*h", f)
    if m:
        hours = int(m.group(1))
        return max(1, 24 // hours)
    m = re.match(r"q(\d+)h", f)
    if m:
        hours = int(m.group(1))
        return max(1, 24 // hours)
    return 1


def extract_drugs(text: str) -> List[Dict[str, Any]]:
    items = []
    for m in EXTRACT_PATTERN.finditer(text):
        name = m.group("name").strip()
        dose = int(m.group("dose"))
        unit = (m.group("unit") or "mg").lower()
        freq = parse_frequency(m.group("freq"))
        items.append({
            "raw_name": name,
            "name": canonicalize(name),
            "dose": dose,
            "unit": unit,
            "freq_per_day": freq,
            "daily_mg": to_mg(dose, unit) * freq,
        })
    return dedupe(items)


def to_mg(amount: float, unit: str) -> float:
    u = unit.lower()
    if u == "mg":
        return amount
    if u == "g":
        return amount * 1000
    if u in ("mcg", "µg"):
        return amount / 1000
    return amount  # unknown -> pass through


def dedupe(items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    merged: Dict[str, Dict[str, Any]] = {}
    for it in items:
        key = it["name"].lower()
        if key not in merged:
            merged[key] = it
        else:
            merged[key]["daily_mg"] += it["daily_mg"]
            merged[key]["freq_per_day"] += it["freq_per_day"]
    return list(merged.values())

# --- Analysis ---


def check_interactions(drug_names: List[str]) -> List[Dict[str, str]]:
    findings = []
    seen = [d.lower() for d in drug_names]
    for i in range(len(seen)):
        for j in range(i+1, len(seen)):
            pair = frozenset([seen[i], seen[j]])
            if pair in INTERACTIONS:
                findings.append({
                    "pair": ", ".join(sorted(pair)),
                    "severity": "warning",
                    "message": INTERACTIONS[pair],
                })
    return findings


def check_age_dosage(age: int, items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    results = []
    for it in items:
        name = it["name"].lower()
        daily_mg = it["daily_mg"]
        rules = DOSAGE_BY_AGE.get(name, [])
        applicable = [r for r in rules if r["min_age"] <= age <= r["max_age"]]
        if not applicable:
            results.append({
                "drug": name,
                "status": "no_guideline",
                "daily_mg": daily_mg,
                "advice": "No age‑specific guideline in demo DB; verify with trusted source.",
            })
            continue
        rule = applicable[0]
        status = "ok" if rule["min"] <= daily_mg <= rule["max"] else ("low" if daily_mg < rule["min"] else "high")
        results.append({
            "drug": name,
            "status": status,
            "daily_mg": daily_mg,
            "range": {"min": rule["min"], "max": rule["max"], "unit": rule["unit"]},
            "note": rule.get("note", ""),
        })
    return results


def suggest_alternatives(drug_names: List[str]) -> Dict[str, List[str]]:
    out: Dict[str, List[str]] = {}
    for d in drug_names:
        alts = ALTERNATIVES.get(d.lower(), [])
        if alts:
            out[d] = alts
    return out


def analyze(age: int, text: str = "", items: List[Dict[str, Any]] | None = None) -> Dict[str, Any]:
    extracted = items or extract_drugs(text)
    names = [i["name"] for i in extracted]
    return {
        "extracted": extracted,
        "interactions": check_interactions(names),
        "dosage": check_age_dosage(age, extracted),
        "alternatives": suggest_alternatives(names),
    }
# backend/logic.py

def extract_drugs(prescription_text):
    # placeholder function
    return ["Paracetamol", "Ibuprofen"]

def analyze(drugs, age):
    # placeholder function
    return {
        "interactions": "No major interactions found.",
        "dosage": "All dosages are within safe limits.",
        "alternatives": ["Aspirin"]
    }
