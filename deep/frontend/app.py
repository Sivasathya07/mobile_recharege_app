import streamlit as st
import requests
import json
import base64
import time
from audio_recorder_streamlit import audio_recorder
import os
from typing import Optional

# Configuration
BACKEND_URL = "http://localhost:8000"  # Default FastAPI port
VOICE_OUTPUT_ENABLED = True

# Initialize session state
if 'prescription_text' not in st.session_state:
    st.session_state.prescription_text = ""
if 'age' not in st.session_state:
    st.session_state.age = None
if 'analysis_results' not in st.session_state:
    st.session_state.analysis_results = None

def generate_voice_summary(results: dict) -> str:
    """Generate natural language summary from analysis results"""
    if not results or not isinstance(results, dict):
        return "No valid results available"
    
    summary = []
    
    # Medications list
    if 'drugs' in results and results['drugs']:
        drug_list = ', '.join(results['drugs'])
        summary.append(f"Found {len(results['drugs'])} medications: {drug_list}")
    
    # Interactions
    if 'interactions' in results and results.get('has_interactions', False):
        summary.append("Interaction warnings:")
        for interaction in results.get('interactions', []):
            drug1 = interaction.get('drug1', 'Unknown drug')
            drug2 = interaction.get('drug2', 'Unknown drug')
            effect = interaction.get('effect', 'Unknown interaction')
            severity = interaction.get('severity', 'unknown severity')
            summary.append(f"{drug1} and {drug2}: {effect} (Severity: {severity})")
    
    # Recommendations
    if 'recommendations' in results and results['recommendations']:
        summary.append("Dosage recommendations:")
        for rec in results['recommendations']:
            drug = rec.get('drug', 'Unknown drug')
            dosage = rec.get('recommended_dosage', 'No dosage specified')
            summary.append(f"{drug}: {dosage}")
    
    return ' '.join(summary) if summary else "No summary available"

def main():
    st.title("AI Medical Prescription Verifier")
    
    # Input Section
    with st.expander("Prescription Input", expanded=True):
        input_method = st.radio("Input method:", ["Text", "Voice"])
        
        if input_method == "Text":
            st.session_state.prescription_text = st.text_area(
                "Enter prescription text:",
                value=st.session_state.prescription_text,
                height=150
            )
        else:
            audio_bytes = audio_recorder(
                text="Click to record prescription",
                recording_color="#e8b62c",
                neutral_color="#6aa36f",
                icon_name="microphone",
                icon_size="2x",
            )
            
            if audio_bytes:
                # In a real implementation, send to backend for speech-to-text
                st.audio(audio_bytes, format="audio/wav")
                st.info("Voice processing would be implemented here")

        st.session_state.age = st.number_input(
            "Patient Age:",
            min_value=0,
            max_value=120,
            value=st.session_state.age if st.session_state.age else 30,
            step=1
        )

    # Analysis Button
    if st.button("Analyze Prescription"):
        if st.session_state.prescription_text:
            with st.spinner("Analyzing prescription..."):
                try:
                    response = requests.post(
                        f"{BACKEND_URL}/analyze-prescription",
                        json={
                            "prescription": st.session_state.prescription_text,
                            "age": st.session_state.age
                        }
                    )
                    st.session_state.analysis_results = response.json()
                    st.success("Analysis complete!")
                except Exception as e:
                    st.error(f"Analysis failed: {str(e)}")
        else:
            st.warning("Please enter prescription text first")

    # Results Display
    if st.session_state.analysis_results:
        st.subheader("Analysis Results") 
        summary = generate_voice_summary(st.session_state.analysis_results)
        with st.expander("Voice Summary"):
            st.text_area("Summary", value=summary, height=150, disabled=True)
            
            if VOICE_OUTPUT_ENABLED:
                if st.button("Read Summary Aloud"):
                    # In a real implementation, this would use text-to-speech
                    st.info("Voice output would be implemented here")

        # Detailed Results in Tabs
        tab1, tab2, tab3 = st.tabs(["Medications", "Interactions", "Recommendations"])
        
        with tab1:
            if 'drugs' in st.session_state.analysis_results:
                st.write("### Identified Medications")
                for i, drug in enumerate(st.session_state.analysis_results['drugs'], 1):
                    st.markdown(f"{i}. **{drug}**")
            else:
                st.warning("No medications identified")

        with tab2:
            if 'interactions' in st.session_state.analysis_results:
                interactions = st.session_state.analysis_results['interactions']
                if interactions.get('has_interactions', False):
                    st.error("⚠️ Potentially dangerous interactions found!")
                    for interaction in interactions.get('interactions', []):
                        st.markdown(f"**{interaction.get('drug1', 'Unknown')} + {interaction.get('drug2', 'Unknown')}**")
                        st.markdown(f"**Severity**: {interaction.get('severity', 'unknown')}")
                        st.markdown(f"**Effect**: {interaction.get('effect', 'Unknown effect')}")
                        st.markdown(f"**Recommendation**: {interaction.get('recommendation', 'Consult provider')}")
                        st.write("---")
                else:
                    st.success("No significant drug interactions found")
            else:
                st.warning("Interaction analysis not available")

        with tab3:
            if 'recommendations' in st.session_state.analysis_results:
                recommendations = st.session_state.analysis_results['recommendations']
                if recommendations:
                    for rec in recommendations:
                        st.markdown(f"**{rec.get('drug', 'Unknown drug')}**")
                        st.markdown(f"Recommended dosage: {rec.get('recommended_dosage', 'Not specified')}")
                        st.write("---")
                else:
                    st.info("No specific recommendations available")
            else:
                st.warning("Recommendations not available")

if __name__ == "__main__":
    main()