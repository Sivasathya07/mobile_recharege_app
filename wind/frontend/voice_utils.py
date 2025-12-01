import speech_recognition as sr
import pyttsx3
import streamlit as st
from gtts import gTTS
import pygame
import io
import tempfile
import os
from typing import Optional
import threading
import time

class VoiceManager:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.microphone = sr.Microphone()
        self.tts_engine = pyttsx3.init()
        
        # Configure TTS engine
        self.tts_engine.setProperty('rate', 150)  # Speed of speech
        self.tts_engine.setProperty('volume', 0.9)  # Volume level (0.0 to 1.0)
        
        # Initialize pygame for audio playback
        pygame.mixer.init()
        
        # Adjust for ambient noise
        with self.microphone as source:
            self.recognizer.adjust_for_ambient_noise(source, duration=1)
    
    def listen_for_speech(self, timeout: int = 5, phrase_time_limit: int = 10) -> Optional[str]:
        """Listen for speech input and convert to text"""
        try:
            with self.microphone as source:
                st.info("🎤 Listening... Please speak now")
                audio = self.recognizer.listen(source, timeout=timeout, phrase_time_limit=phrase_time_limit)
            
            st.info("🔄 Processing speech...")
            text = self.recognizer.recognize_google(audio)
            st.success(f"✅ Recognized: {text}")
            return text
            
        except sr.WaitTimeoutError:
            st.warning("⏰ No speech detected within timeout period")
            return None
        except sr.UnknownValueError:
            st.error("❌ Could not understand the audio")
            return None
        except sr.RequestError as e:
            st.error(f"❌ Error with speech recognition service: {e}")
            return None
        except Exception as e:
            st.error(f"❌ Unexpected error: {e}")
            return None
    
    def speak_text(self, text: str, use_gtts: bool = True):
        """Convert text to speech and play it"""
        try:
            if use_gtts:
                # Use Google Text-to-Speech for better quality
                tts = gTTS(text=text, lang='en', slow=False)
                
                # Create temporary file
                with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as tmp_file:
                    tts.save(tmp_file.name)
                    
                    # Play the audio file
                    pygame.mixer.music.load(tmp_file.name)
                    pygame.mixer.music.play()
                    
                    # Wait for playback to complete
                    while pygame.mixer.music.get_busy():
                        time.sleep(0.1)
                    
                    # Clean up temporary file
                    os.unlink(
                        
                        tmp_file.name)
            else:
                # Use pyttsx3 for offline TTS
                self.tts_engine.say(text)
                self.tts_engine.runAndWait()
                
        except Exception as e:
            st.error(f"❌ Error with text-to-speech: {e}")
            # Fallback to pyttsx3
            try:
                self.tts_engine.say(text)
                self.tts_engine.runAndWait()
            except:
                st.error("❌ Both TTS engines failed")
    
    def speak_text_async(self, text: str, use_gtts: bool = True):
        """Convert text to speech asynchronously"""
        thread = threading.Thread(target=self.speak_text, args=(text, use_gtts))
        thread.daemon = True
        thread.start()

# Global voice manager instance
@st.cache_resource
def get_voice_manager():
    return VoiceManager()

def voice_input_component(key: str = "voice_input") -> Optional[str]:
    """Streamlit component for voice input"""
    col1, col2 = st.columns([1, 4])
    
    with col1:
        if st.button("🎤 Voice Input", key=f"voice_btn_{key}"):
            voice_manager = get_voice_manager()
            return voice_manager.listen_for_speech()
    
    with col2:
        st.write("Click the microphone button and speak clearly")
    
    return None

def voice_output_component(text: str, key: str = "voice_output"):
    """Streamlit component for voice output"""
    col1, col2 = st.columns([1, 4])
    
    with col1:
        if st.button("🔊 Speak", key=f"speak_btn_{key}"):
            voice_manager = get_voice_manager()
            voice_manager.speak_text_async(text)
    
    with col2:
        st.write("Click to hear the text spoken aloud")

def smart_voice_input(prompt: str, key: str = "smart_voice") -> str:
    """Enhanced voice input with fallback to text input"""
    st.write(f"**{prompt}**")
    
    col1, col2 = st.columns([1, 1])
    
    with col1:
        voice_text = voice_input_component(key=f"{key}_voice")
        if voice_text:
            return voice_text
    
    with col2:
        text_input = st.text_input("Or type here:", key=f"{key}_text", placeholder="Enter text manually")
        if text_input:
            return text_input
    
    return ""
