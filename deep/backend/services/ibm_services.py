from ibm_watson import SpeechToTextV1, TextToSpeechV1, NaturalLanguageUnderstandingV1
from ibm_watson.natural_language_understanding_v1 import Features, EntitiesOptions, KeywordsOptions
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
import os
from typing import Dict, Any

# Configure with your IBM Cloud credentials
IBM_API_KEY = os.getenv("IBM_API_KEY", "your-ibm-api-key")
IBM_SERVICE_URL = os.getenv("IBM_SERVICE_URL", "your-ibm-service-url")

class IBMServices:
    def __init__(self):
        self.stt = self._setup_speech_to_text()
        self.tts = self._setup_text_to_speech()
        self.nlu = self._setup_natural_language_understanding()

    def _setup_speech_to_text(self):
        authenticator = IAMAuthenticator(IBM_API_KEY)
        stt = SpeechToTextV1(authenticator=authenticator)
        stt.set_service_url(IBM_SERVICE_URL)
        return stt

    def _setup_text_to_speech(self):
        authenticator = IAMAuthenticator(IBM_API_KEY)
        tts = TextToSpeechV1(authenticator=authenticator)
        tts.set_service_url(IBM_SERVICE_URL)
        return tts

    def _setup_natural_language_understanding(self):
        authenticator = IAMAuthenticator(IBM_API_KEY)
        nlu = NaturalLanguageUnderstandingV1(
            version='2022-04-07',
            authenticator=authenticator
        )
        nlu.set_service_url(IBM_SERVICE_URL)
        return nlu
 
    def speech_to_text(self,audio_file_path: str) -> str:
        with open(audio_file_path, 'rb') as audio_file:
            result = self.stt.recognize(
                audio=audio_file,
                content_type='audio/wav',
                model='en-US_Medical'
            ).get_result()
        return ' '.join([alt['transcript'] for res in result['results'] for alt in res['alternatives']])

    def text_to_speech(self, text: str, output_file: str = "output.wav"):
        with open(output_file, 'wb') as audio_file:
            audio_file.write(
                self.tts.synthesize(
                    text,
                    voice='en-US_AllisonV3Voice',
                    accept='audio/wav'
                ).get_result().content
            )
        return output_file

    def analyze_text(self, text: str) -> Dict[str, Any]:
        response = self.nlu.analyze(
            text=text,
            features=Features(
                entities=EntitiesOptions(model='clinical-model'),
                keywords=KeywordsOptions()
            )).get_result()
        return response

ibm_services = IBMServices()

def analyze_with_watson(text: str) -> Dict[str, Any]:
    return ibm_services.analyze_text(text)

def speech_to_text(audio_file: str) -> str:
    return ibm_services.speech_to_text(audio_file)

def text_to_speech(text: str, output_file: str) -> str:
    return ibm_services.text_to_speech(text, output_file)