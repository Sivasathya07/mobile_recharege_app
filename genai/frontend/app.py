# frontend/app.py
import streamlit as st
import requests

# Backend URL (can be changed in Streamlit Secrets)
BACKEND = "http://127.0.0.1:8000"

# Streamlit page settings
st.set_page_config(page_title="AI Rx Verifier", page_icon="💊", layout="centered")

st.title("💊 AI Medical Prescription Verifier")
st.caption("Demo – Checks interactions, age-based dosage, and suggests alternatives")

# Form for user input
with st.form("rx_form"):
    age = st.number_input("Patient Age (years)", min_value=0, max_value=120, value=30)
    text = st.text_area(
        "Paste prescription or enter medication details",
        value="Paracetamol 500 mg twice\nIbuprofen 200 mg 3x",
        height=150
    )
    submitted = st.form_submit_button("Check Prescription")

# Process form submission
if submitted:
    if not text.strip():
        st.warning("⚠️ Please enter a prescription.")
    else:
        with st.spinner("Analyzing prescription..."):
            try:
                # Send data to backend
                response = requests.post(
                    f"{BACKEND}/analyze",
                    json={"age": age, "text": text}
                )

                if response.status_code == 200:
                    data = response.json()

                    st.subheader("🔍 Analysis Results")
                    
                    # Drug Interactions
                    if "interactions" in data and data["interactions"]:
                        st.write("**Possible Drug Interactions:**")
                        for inter in data["interactions"]:
                            st.error(f"- {inter}")
                    else:
                        st.success("No major drug interactions found.")

                    # Dosage Checks
                    if "dosage_issues" in data and data["dosage_issues"]:
                        st.write("**Dosage Concerns:**")
                        for issue in data["dosage_issues"]:
                            st.warning(f"- {issue}")
                    else:
                        st.success("Dosages appear safe for the given age.")

                    # Alternatives
                    if "alternatives" in data and data["alternatives"]:
                        st.write("**Suggested Alternatives:**")
                        for alt in data["alternatives"]:
                            st.info(f"- {alt}")

                else:
                    st.error(f"Backend error: {response.status_code} - {response.text}")

            except Exception as e:
                st.error(f"Request failed: {e}")
