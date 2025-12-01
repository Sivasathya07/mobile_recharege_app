import streamlit as st
import requests
import json
import speech_recognition as sr
from gtts import gTTS
import os
from io import BytesIO

st.set_page_config(page_title="AI Medical Prescription Verification", layout="wide")

st.title("AI Medical Prescription Verification")
st.markdown("Enter drug details, upload a prescription image, or use voice input to analyze interactions, dosages, and alternatives.")

# Tabs for different input methods
tab1, tab2, tab3 = st.tabs(["Manual Input", "Image Upload", "Voice Input"])

with tab1:
    with st.form("drug_form"):
        drugs = st.text_input("Enter drugs (comma-separated, e.g., aspirin, ibuprofen):")
        age = st.number_input("Patient Age", min_value=0, max_value=120, value=18)
        text_input = st.text_area("Enter unstructured medical text (optional):", "")
        submit = st.form_submit_button("Analyze")
    API_URL = "http://127.0.0.1:8000/analyze"
    if submit:
        if not drugs:
            st.error("Please enter at least one drug.")
        else:
            drug_list = [drug.strip() for drug in drugs.split(",")]
            payload = {"drugs": drug_list, "age": age, "text": text_input if text_input else None}
            try:
                response = requests.post(API_URL, json=payload)
                response.raise_for_status()
                result = response.json()
                st.subheader("Results")
                st.write("*Drug Interactions*")
                for interaction in result["interactions"]:
                    st.write(f"- {interaction}")
                st.write("*Dosage Recommendations*")
                for dosage in result["dosages"]:
                    st.write(f"- {dosage}")
                st.write("*Alternative Medications*")
                for alt in result["alternatives"]:
                    st.write(f"- {alt}")
                if result["extracted_info"]:
                    st.write("*Extracted Drug Information (NLP)*")
                    for info in result["extracted_info"]:
                        st.write(f"- {json.dumps(info)}")
                # Voice output
                result_text = "\n".join([f"Interactions: {', '.join(result['interactions']) or 'None'}",
                                       f"Dosages: {', '.join(result['dosages'])}",
                                       f"Alternatives: {', '.join(result['alternatives'])}"])
                tts = gTTS(text=result_text, lang='en')
                audio_file = BytesIO()
                tts.write_to_fp(audio_file)
                st.audio(audio_file, format="audio/mp3")
            except requests.exceptions.RequestException as e:
                st.error(f"Error connecting to backend: {str(e)}")

# with tab2:
#     with st.form("image_form"):
#         uploaded_file = st.file_uploader("Upload Prescription Image", type=["png", "jpg", "jpeg"])
#         age = st.number_input("Patient Age", min_value=0, max_value=120, value=18, key="image_age")
#         submit_image = st.form_submit_button("Analyze Image")
#     API_URL_IMAGE = "http://127.0.0.1:8000/upload-analyze"
#     if submit_image and uploaded_file:
#         files = {"file": (uploaded_file.name, uploaded_file.getvalue(), uploaded_file.type)}
#         data = {"age": age}
#         try:
#             response = requests.post(API_URL_IMAGE, files=files, data=data)
#             response.raise_for_status()
#             result = response.json()
#             st.subheader("Results from Image")
#             st.write("*Extracted Text*:")
#             st.text(result["extracted_text"])
#             st.write("*Drug Interactions*")
#             for interaction in result["interactions"]:
#                 st.write(f"- {interaction}")
#             st.write("*Dosage Recommendations*")
#             for dosage in result["dosages"]:
#                 st.write(f"- {dosage}")
#             st.write("*Alternative Medications*")
#             for alt in result["alternatives"]:
#                 st.write(f"- {alt}")
#             # Voice output
#             result_text = "\n".join([f"Interactions: {', '.join(result['interactions']) or 'None'}",
#                                    f"Dosages: {', '.join(result['dosages'])}",
#                                    f"Alternatives: {', '.join(result['alternatives'])}"])
#             tts = gTTS(text=result_text, lang='en')
#             audio_file = BytesIO()
#             tts.write_to_fp(audio_file)
#             st.audio(audio_file, format="audio/mp3")
#         except requests.exceptions.RequestException as e:
#             st.error(f"Error processing image: {str(e)}")

# import streamlit as st
# import requests
# from gtts import gTTS
# from io import BytesIO

# with tab2:
#     with st.form("image_form"):
#         uploaded_file = st.file_uploader(
#             "Upload Prescription Image", 
#             type=["png", "jpg", "jpeg"]
#         )
#         age = st.number_input(
#             "Patient Age", 
#             min_value=0, max_value=120, value=18, key="image_age"
#         )
#         submit_image = st.form_submit_button("Analyze Image")

#     API_URL_IMAGE = "http://127.0.0.1:8000/upload-analyze"

#     if submit_image and uploaded_file:
#         files = {
#             "file": (uploaded_file.name, uploaded_file.read(), uploaded_file.type)
#         }
#         data = {"age": str(age)}  # send as string for form-data

#         try:
#             response = requests.post(API_URL_IMAGE, files=files, data=data)
#             response.raise_for_status()
#             result = response.json()

#             st.subheader("Results from Image")
#             st.write("*Extracted Text*:")
#             st.text(result.get("extracted_text", ""))

#             st.write("*Drug Interactions*")
#             for interaction in result.get("interactions", []):
#                 st.write(f"- {interaction}")

#             st.write("*Dosage Recommendations*")
#             for dosage in result.get("dosages", []):
#                 st.write(f"- {dosage}")

#             st.write("*Alternative Medications*")
#             for alt in result.get("alternatives", []):
#                 st.write(f"- {alt}")

#             # Voice output
#             result_text = "\n".join([
#                 f"Interactions: {', '.join(result.get('interactions', [])) or 'None'}",
#                 f"Dosages: {', '.join(result.get('dosages', [])) or 'None'}",
#                 f"Alternatives: {', '.join(result.get('alternatives', [])) or 'None'}"
#             ])
#             tts = gTTS(text=result_text, lang='en')
#             audio_file = BytesIO()
#             tts.write_to_fp(audio_file)
#             audio_file.seek(0)
#             st.audio(audio_file, format="audio/mp3")

#         except requests.exceptions.RequestException as e:
#             st.error(f"Error processing image: {str(e)}")

import streamlit as st
import requests
from gtts import gTTS
from io import BytesIO

with tab2:
    with st.form("image_form"):
        uploaded_file = st.file_uploader(
            "Upload Prescription Image",
            type=["png", "jpg", "jpeg"]
        )
        age = st.number_input(
            "Patient Age",
            min_value=0, max_value=120,
            value=18,
            key="image_age"
        )
        submit_image = st.form_submit_button("Analyze Image")

    API_URL_IMAGE = "http://127.0.0.1:8000/upload-analyze"

    if submit_image and uploaded_file:
        # FIXED: use read() instead of getvalue()
        files = {
            "file": (uploaded_file.name, uploaded_file.read(), uploaded_file.type)
        }
        # Send age as string so FastAPI Form() can parse it
        data = {"age": str(age)}

        try:
            response = requests.post(API_URL_IMAGE, files=files, data=data)
            response.raise_for_status()
            result = response.json()

            st.subheader("Results from Image")

            st.write("*Extracted Text*:")
            st.text(result.get("extracted_text", ""))

            st.write("*Drug Interactions*")
            for interaction in result.get("interactions", []):
                st.write(f"- {interaction}")

            st.write("*Dosage Recommendations*")
            for dosage in result.get("dosages", []):
                st.write(f"- {dosage}")

            st.write("*Alternative Medications*")
            for alt in result.get("alternatives", []):
                st.write(f"- {alt}")

            # Voice output
            result_text = "\n".join([
                f"Interactions: {', '.join(result.get('interactions', [])) or 'None'}",
                f"Dosages: {', '.join(result.get('dosages', [])) or 'None'}",
                f"Alternatives: {', '.join(result.get('alternatives', [])) or 'None'}"
            ])
            tts = gTTS(text=result_text, lang='en')
            audio_file = BytesIO()
            tts.write_to_fp(audio_file)
            audio_file.seek(0)
            st.audio(audio_file, format="audio/mp3")

        except requests.exceptions.RequestException as e:
            st.error(f"Error processing image: {str(e)}")

from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from typing import List

app = FastAPI()

@app.post("/upload-analyze")
async def upload_analyze(file: UploadFile = File(...), age: int = Form(...)):
    try:
        # Read file bytes
        contents = await file.read()

        # TODO: Add your OCR / analysis logic here
        # For now, let's just return dummy data
        return {
            "extracted_text": "Paracetamol 500mg twice daily",
            "interactions": ["None found"],
            "dosages": [f"{age} years: safe dosage - 500mg twice daily"],
            "alternatives": ["Ibuprofen", "Aspirin"]
        }

    except Exception as e:
        # Prevents 500 crash and sends error details back to Streamlit
        return JSONResponse(
            status_code=400,
            content={"error": str(e)}
        )



with tab3:
    with st.form("voice_form"):
        age = st.number_input("Patient Age", min_value=0, max_value=120, value=18, key="voice_age")
        submit_voice = st.form_submit_button("Record Voice")
    API_URL_VOICE = "http://127.0.0.1:8000/voice-analyze"
    if submit_voice:
        recognizer = sr.Recognizer()
        with sr.Microphone() as source:
            st.write("Recording... Speak now (5 seconds)")
            audio = recognizer.listen(source, timeout=5)
        try:
            transcript = recognizer.recognize_google(audio)
            st.write(f"Transcribed: {transcript}")
            payload = {"transcript": transcript, "age": age}
            response = requests.post(API_URL_VOICE, json=payload)
            response.raise_for_status()
            result = response.json()
            st.subheader("Results from Voice")
            st.write("*Drug Interactions*")
            for interaction in result["interactions"]:
                st.write(f"- {interaction}")
            st.write("*Dosage Recommendations*")
            for dosage in result["dosages"]:
                st.write(f"- {dosage}")
            st.write("*Alternative Medications*")
            for alt in result["alternatives"]:
                st.write(f"- {alt}")
            # Voice output
            result_text = "\n".join([f"Interactions: {', '.join(result['interactions']) or 'None'}",
                                   f"Dosages: {', '.join(result['dosages'])}",
                                   f"Alternatives: {', '.join(result['alternatives'])}"])
            tts = gTTS(text=result_text, lang='en')
            audio_file = BytesIO()
            tts.write_to_fp(audio_file)
            st.audio(audio_file, format="audio/mp3")
        except sr.UnknownValueError:
            st.error("Could not understand audio")
        except sr.RequestError as e:
            st.error(f"Could not request results; {str(e)}")
        except requests.exceptions.RequestException as e:
            st.error(f"Error connecting to backend: {str(e)}")