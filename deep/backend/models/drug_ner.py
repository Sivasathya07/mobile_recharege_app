from transformers import pipeline
from typing import List

# Initialize Hugging Face NER pipeline
try:
    drug_ner = pipeline("ner", model="d4data/biomedical-ner-all", device="cpu")
except:
    # Fallback to simpler model if the primary one fails to load
    drug_ner = pipeline("ner", model="dslim/bert-base-NER", device="cpu")

def extract_drugs(text: str) -> List[str]:
    """Extract drug names from prescription text"""
    entities = drug_ner(text)
    drugs = set()
    
    current_drug = ""
    for entity in entities:
        if entity['entity'] in ['B-DRUG', 'I-DRUG']:
            if entity['entity'] == 'B-DRUG' and current_drug:
                drugs.add(current_drug.strip())
                current_drug = entity['word'] 
            else:
                current_drug += " " + entity['word']
        elif current_drug:
            drugs.add(current_drug.strip())
            current_drug = ""
    
    if current_drug:
        drugs.add(current_drug.strip())
    
    # Simple post-processing
    processed_drugs = []
    for drug in drugs:
        # Remove common prefixes/suffixes
        if drug.startswith("##"):
            drug = drug[2:]
        if drug.endswith("##"):
            drug = drug[:-2]
        processed_drugs.append(drug)
    
    return list(set(processed_drugs))