import json
import os
from typing import Dict, List, Optional
from pathlib import Path
from pydantic import BaseModel, validator
import sqlite3
from sqlite3 import Connection
from contextlib import contextmanager
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database models
class Drug(BaseModel):
    name: str
    generic_name: Optional[str] = None
    drug_class: Optional[str] = None
    description: Optional[str] = None
    contraindications: Optional[List[str]] = None
    side_effects: Optional[List[str]] = None

    @validator('name')
    def name_must_be_lowercase(cls, v):
        return v.lower()

class DrugInteraction(BaseModel):
    drug1: str
    drug2: str
    severity: str  # 'high', 'moderate', 'low', 'none'
    effect: str
    mechanism: Optional[str] = None
    recommendation: str
    references: Optional[List[str]] = None

class AgeDosage(BaseModel):
    age_range: str  # '0-12', '13-18', '19-65', '65+'
    dosage: str
    frequency: str
    notes: Optional[str] = None

class AlternativeDrug(BaseModel):
    name: str
    reason: str
    equivalence_ratio: Optional[float] = None
    min_age: Optional[int] = None
    max_age: Optional[int] = None

class DrugDatabase:
    def __init__(self, db_path: str = None):
        self.db_path = db_path or self._get_default_db_path()
        self._initialize_database()

    def _get_default_db_path(self) -> str:
        """Get the default path for the drug database"""
        return str(Path(__file__).parent.parent.parent / 'data' / 'drugs.db')

    # In database.py
from typing import Generator
import sqlite3
from contextlib import contextmanager

@contextmanager
def get_connection(self) -> Generator[sqlite3.Connection, None, None]:
    """Properly typed database connection generator"""
    conn = sqlite3.connect(self.db_path)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()


    def _initialize_database(self):
        """Initialize the database with required tables"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            
            # Create drugs table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS drugs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL UNIQUE,
                    generic_name TEXT,
                    drug_class TEXT,
                    description TEXT,
                    contraindications TEXT,  # JSON array
                    side_effects TEXT       # JSON array
                )
            """)
            
            # Create interactions table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS interactions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    drug1 TEXT NOT NULL,
                    drug2 TEXT NOT NULL,
                    severity TEXT NOT NULL,
                    effect TEXT NOT NULL,
                    mechanism TEXT,
                    recommendation TEXT NOT NULL,
                    references TEXT,       # JSON array
                    UNIQUE(drug1, drug2)
                )
            """)
            
            # Create dosage table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS dosages (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    drug_id INTEGER NOT NULL,
                    age_range TEXT NOT NULL,
                    dosage TEXT NOT NULL,
                    frequency TEXT NOT NULL,
                    notes TEXT,
                    FOREIGN KEY(drug_id) REFERENCES drugs(id),
                    UNIQUE(drug_id, age_range)
                )
            """)
            
            # Create alternatives table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS alternatives (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    original_drug_id INTEGER NOT NULL,
                    alternative_name TEXT NOT NULL,
                    reason TEXT NOT NULL,
                    equivalence_ratio REAL,
                    min_age INTEGER,
                    max_age INTEGER,
                    FOREIGN KEY(original_drug_id) REFERENCES drugs(id)
                )
            """)
            
            conn.commit()

    def add_drug(self, drug: Drug) -> int:
        """Add a new drug to the database"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO drugs (name, generic_name, drug_class, description, contraindications, side_effects)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (
                drug.name,
                drug.generic_name,
                drug.drug_class,
                drug.description,
                json.dumps(drug.contraindications) if drug.contraindications else None,
                json.dumps(drug.side_effects) if drug.side_effects else None
            ))
            conn.commit()
            return cursor.lastrowid

    def add_interaction(self, interaction: DrugInteraction) -> int:
        """Add a new drug interaction to the database"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO interactions (drug1, drug2, severity, effect, mechanism, recommendation, references)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                interaction.drug1.lower(),
                interaction.drug2.lower(),
                interaction.severity,
                interaction.effect,
                interaction.mechanism,
                interaction.recommendation,
                json.dumps(interaction.references) if interaction.references else None
            ))
            conn.commit()
            return cursor.lastrowid

    def add_dosage(self, drug_name: str, dosage: AgeDosage) -> int:
        """Add age-specific dosage information for a drug"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id FROM drugs WHERE name = ?", (drug_name.lower(),))
            drug_id = cursor.fetchone()[0]
            
            cursor.execute("""
                INSERT INTO dosages (drug_id, age_range, dosage, frequency, notes)
                VALUES (?, ?, ?, ?, ?)
            """, (
                drug_id,
                dosage.age_range,
                dosage.dosage,
                dosage.frequency,
                dosage.notes
            ))
            conn.commit()
            return cursor.lastrowid

    def add_alternative(self, original_drug_name: str, alternative: AlternativeDrug) -> int:
        """Add an alternative drug to the database"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id FROM drugs WHERE name = ?", (original_drug_name.lower(),))
            drug_id = cursor.fetchone()[0]
            
            cursor.execute("""
                INSERT INTO alternatives (original_drug_id, alternative_name, reason, equivalence_ratio, min_age, max_age)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (
                drug_id,
                alternative.name,
                alternative.reason,
                alternative.equivalence_ratio,
                alternative.min_age,
                alternative.max_age
            ))
            conn.commit()
            return cursor.lastrowid

    def get_drug(self, drug_name: str) -> Optional[Dict]:
        """Retrieve a drug by name"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT * FROM drugs WHERE name = ?
            """, (drug_name.lower(),))
            row = cursor.fetchone()
            
            if row:
                return self._row_to_dict(row)
            return None

    def get_interaction(self, drug1: str, drug2: str) -> Optional[Dict]:
        """Retrieve interaction between two drugs"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            # Check both directions (A+B and B+A)
            cursor.execute("""
                SELECT * FROM interactions 
                WHERE (drug1 = ? AND drug2 = ?) OR (drug1 = ? AND drug2 = ?)
            """, (
                drug1.lower(), drug2.lower(),
                drug2.lower(), drug1.lower()
            ))
            row = cursor.fetchone()
            
            if row:
                return self._row_to_dict(row)
            return None

    def get_dosages(self, drug_name: str) -> List[Dict]:
        """Retrieve all dosage information for a drug"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT d.* FROM dosages d
                JOIN drugs dr ON d.drug_id = dr.id
                WHERE dr.name = ?
            """, (drug_name.lower(),))
            
            return [self._row_to_dict(row) for row in cursor.fetchall()]

    def get_alternatives(self, original_drug_name: str, age: int = None) -> List[Dict]:
        """Retrieve alternative drugs with optional age filtering"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            
            query = """
                SELECT a.* FROM alternatives a
                JOIN drugs d ON a.original_drug_id = d.id
                WHERE d.name = ?
            """
            params = [original_drug_name.lower()]
            
            if age is not None:
                query += " AND (a.min_age IS NULL OR a.min_age <= ?) AND (a.max_age IS NULL OR a.max_age >= ?)"
                params.extend([age, age])
            
            cursor.execute(query, params)
            return [self._row_to_dict(row) for row in cursor.fetchall()]

    def search_drugs(self, query: str, limit: int = 10) -> List[Dict]:
        """Search for drugs by name or generic name"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT * FROM drugs 
                WHERE name LIKE ? OR generic_name LIKE ?
                LIMIT ?
            """, (
                f"%{query.lower()}%",
                f"%{query.lower()}%",
                limit
            ))
            return [self._row_to_dict(row) for row in cursor.fetchall()]

    def _row_to_dict(self, row) -> Dict:
        """Convert SQLite row to dictionary with proper JSON parsing"""
        if row is None:
            return None
            
        result = dict(row)
        
        # Parse JSON fields
        json_fields = ['contraindications', 'side_effects', 'references']
        for field in json_fields:
            if field in result and result[field]:
                try:
                    result[field] = json.loads(result[field])
                except json.JSONDecodeError:
                    result[field] = None
        
        return result

    def import_from_json(self, json_file: str):
        """Import drug data from a JSON file"""
        with open(json_file) as f:
            data = json.load(f)
            
        with self._get_connection() as conn:
            cursor = conn.cursor()
            
            # Import drugs
            for drug_data in data.get('drugs', []):
                try:
                    drug = Drug(**drug_data)
                    self.add_drug(drug)
                    
                    # Import dosages
                    for dosage_data in drug_data.get('age_dosage', []):
                        dosage = AgeDosage(**dosage_data)
                        self.add_dosage(drug.name, dosage)
                    
                    # Import alternatives
                    for alt_data in drug_data.get('alternatives', []):
                        alternative = AlternativeDrug(**alt_data)
                        self.add_alternative(drug.name, alternative)
                    
                except Exception as e:
                    logger.error(f"Failed to import drug {drug_data.get('name')}: {e}")
            
            # Import interactions
            for interaction_data in data.get('interactions', []):
                try:
                    interaction = DrugInteraction(**interaction_data)
                    self.add_interaction(interaction)
                except Exception as e:
                    logger.error(f"Failed to import interaction between {interaction_data.get('drug1')} and {interaction_data.get('drug2')}: {e}")
            
            conn.commit()

# Initialize global database instance
drug_db = DrugDatabase()

# Example usage
if __name__ == "__main__":
    # Initialize with test data
    db = DrugDatabase(":memory:")
    
    # Add sample drug
    aspirin = Drug(
        name="aspirin",
        generic_name="acetylsalicylic acid",
        drug_class="NSAID",
        description="Pain reliever and anti-inflammatory",
        contraindications=["bleeding disorders", "asthma"],
        side_effects=["stomach pain", "heartburn"]
    )
    db.add_drug(aspirin)
    
    # Add dosage
    dosage = AgeDosage(
        age_range="18-65",
        dosage="325-650 mg",
        frequency="Every 4-6 hours",
        notes="Do not exceed 4000 mg daily"
    )
    db.add_dosage("aspirin", dosage)
    
    # Add interaction
    interaction = DrugInteraction(
        drug1="aspirin",
        drug2="ibuprofen",
        severity="moderate",
        effect="Increased risk of gastrointestinal bleeding",
        recommendation="Avoid concurrent use"
    )
    db.add_interaction(interaction)
    
    # Add alternative
    alternative = AlternativeDrug(
        name="acetaminophen",
        reason="Safer for patients with bleeding risk",
        min_age=0
    )
    db.add_alternative("aspirin", alternative)
    
    # Query examples
    print("Aspirin details:", db.get_drug("aspirin"))
    print("Aspirin-Ibuprofen interaction:", db.get_interaction("aspirin", "ibuprofen"))
    print("Aspirin dosages:", db.get_dosages("aspirin"))
    print("Aspirin alternatives:", db.get_alternatives("aspirin"))

    # Update the connection generator function in database.py
