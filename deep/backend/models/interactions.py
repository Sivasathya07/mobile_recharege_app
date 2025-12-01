from typing import Dict, List, Optional
import json
from transformers import pipeline
import requests

# Load drug interaction database
with open('../../data/drug_db.json') as f:
    DRUG_DB = json.load(f)

try:
    interaction_model = pipeline(
        "text-classification",
        model="bert-base-uncased",
        framework="pt"
    )
except Exception as e:
    print(f"Failed to load interaction model: {e}")
    interaction_model = None

class DrugInteractionAnalyzer:
    def __init__(self):
        self.interaction_cache = {}
        self.severity_levels = {
            'high': {'color': 'red', 'weight': 3},
            'moderate': {'color': 'orange', 'weight': 2},
            'low': {'color': 'yellow', 'weight': 1},
            'none': {'color': 'green', 'weight': 0}
        }

    def predict_interaction(self, drug1: str, drug2: str) -> Dict[str, str]:
        """Predict interaction between two drugs using ML model"""
        if interaction_model is None:
            return {
                'severity': 'unknown',
                'effect': 'Model not available',
                'recommendation': 'Consult drug database'
            }

        # Create a prompt for the model
        prompt = f"What happens when you take {drug1} and {drug2} together?"
        
        try:
            result = interaction_model(prompt)[0]
            return {
                'severity': self._map_severity(result['label']),
                'effect': result.get('effect', 'Possible interaction'),
                'recommendation': self._generate_recommendation(drug1, drug2, result['label'])
            }
        except Exception as e:
            print(f"Interaction prediction failed: {e}")
            return {
                'severity': 'unknown',
                'effect': 'Prediction error',
                'recommendation': 'Consult a pharmacist'
            }

    def _map_severity(self, label: str) -> str:
        """Map model output to severity levels"""
        label = label.lower()
        if 'danger' in label or 'severe' in label:
            return 'high'
        elif 'moderate' in label or 'warning' in label:
            return 'moderate'
        elif 'mild' in label or 'minor' in label:
            return 'low'
        else:
            return 'none'

    def _generate_recommendation(self, drug1: str, drug2: str, severity: str) -> str:
        """Generate recommendation based on severity"""
        severity = severity.lower()
        
        if 'high' in severity:
            return f"Avoid combining {drug1} and {drug2}. Consider alternative medications."
        elif 'moderate' in severity:
            return (f"Use caution when combining {drug1} and {drug2}. "
                   "Monitor for adverse effects or adjust dosages.")
        elif 'low' in severity:
            return f"Minor interaction between {drug1} and {drug2}. Monitor patient."
        else:
            return f"No significant interaction expected between {drug1} and {drug2}."

    def check_database_interaction(self, drug1: str, drug2: str) -> Optional[Dict]:
        """Check interaction in the drug database"""
        drug1 = drug1.lower()
        drug2 = drug2.lower()
        
        # Check cache first
        cache_key = f"{drug1}_{drug2}" if drug1 < drug2 else f"{drug2}_{drug1}"
        if cache_key in self.interaction_cache:
            return self.interaction_cache[cache_key]
        
        # Check database
        interactions = DRUG_DB.get(drug1, {}).get('interactions', {})
        if drug2 in interactions:
            self.interaction_cache[cache_key] = interactions[drug2]
            return interactions[drug2]
        
        # Check reverse
        interactions = DRUG_DB.get(drug2, {}).get('interactions', {})
        if drug1 in interactions:
            self.interaction_cache[cache_key] = interactions[drug1]
            return interactions[drug1]
        
        return None

    def check_interactions(self, drugs: List[str]) -> Dict:
        """Check all pairwise interactions between a list of drugs"""
        interactions = []
        has_interactions = False
        drug_pairs = []        
        for i in range(len(drugs)):
            for j in range(i+1, len(drugs)):
                drug_pairs.append((drugs[i], drugs[j]))
        for drug1, drug2 in drug_pairs:
            db_interaction = self.check_database_interaction(drug1, drug2) 
            if db_interaction:
                interactions.append({
                    'drug1': drug1,
                    'drug2': drug2,
                    'severity': db_interaction.get('severity', 'moderate'),
                    'effect': db_interaction.get('effect', 'Unknown interaction'),
                    'recommendation': db_interaction.get('recommendation', 'Consult healthcare provider'),
                    'source': 'database'
                })
                if db_interaction.get('severity', 'moderate') != 'none':
                    has_interactions = True
            else:
                pred_interaction = self.predict_interaction(drug1, drug2)
                interactions.append({
                    'drug1': drug1,
                    'drug2': drug2,
                    **pred_interaction,
                    'source': 'model'
                })
                if pred_interaction['severity'] != 'none':
                    has_interactions = True
        
        return {
            'has_interactions': has_interactions,
            'interactions': interactions,
            'drug_count': len(drugs),
            'interaction_count': sum(1 for i in interactions if i['severity'] != 'none')
        }

# Global analyzer instance
interaction_analyzer = DrugInteractionAnalyzer()

def check_interactions(drugs: List[str]) -> Dict:
    """Public interface for interaction checking"""
    return interaction_analyzer.check_interactions(drugs)