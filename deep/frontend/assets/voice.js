// Voice recording and playback functionality
class VoiceInterface {
    constructor() {
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.isRecording = false;
        this.audioContext = null;
        this.audioElement = null;
        this.audioStream = null;
    }

    // Initialize audio context
    async init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            return true;
        } catch (error) {
            console.error('Audio context initialization failed:', error);
            return false;
        }
    }

    // Start voice recording
    async startRecording() {
        try {
            this.audioChunks = [];
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.audioStream = stream;
            this.mediaRecorder = new MediaRecorder(stream);
            
            this.mediaRecorder.ondataavailable = event => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };
            
            this.mediaRecorder.start(100); // Collect data every 100ms
            this.isRecording = true;
            
            return true;
        } catch (error) {
            console.error('Recording failed:', error);
            return false;
        }
    }

    // Stop voice recording
    async stopRecording() {
        if (!this.mediaRecorder || !this.isRecording) return null;
        
        return new Promise((resolve) => {
            this.mediaRecorder.onstop = () => {
                this.isRecording = false;
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
                this.cleanupRecording();
                resolve(audioBlob);
            };
            
            this.mediaRecorder.stop();
            this.audioStream.getTracks().forEach(track => track.stop());
        });
    }

    // Clean up recording resources
    cleanupRecording() {
        if (this.audioStream) {
            this.audioStream.getTracks().forEach(track => track.stop());
            this.audioStream = null;
        }
        this.mediaRecorder = null;
    }

    // Play audio from blob
    async playAudio(blob) {
        if (!blob) return false;
        
        try {
            if (this.audioElement) {
                this.audioElement.pause();
                URL.revokeObjectURL(this.audioElement.src);
            }
            
            const audioUrl = URL.createObjectURL(blob);
            this.audioElement = new Audio(audioUrl);
            await this.audioElement.play();
            return true;
        } catch (error) {
            console.error('Playback failed:', error);
            return false;
        }
    }

    // Convert blob to base64 for API upload
    blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result.split(',')[1];
                resolve(result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    // Text-to-speech using browser API (fallback)
    async speak(text, lang = 'en-US') {
        if (!window.speechSynthesis) {
            console.warn('Speech synthesis not supported');
            return false;
        }
        
        return new Promise((resolve) => {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            
            utterance.onend = () => resolve(true);
            utterance.onerror = (event) => {
                console.error('Speech synthesis error:', event);
                resolve(false);
            };
            
            speechSynthesis.speak(utterance);
        });
    }
}

// Initialize voice interface when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.voiceInterface = new VoiceInterface();
    window.voiceInterface.init();
});

// Streamlit-specific functions
function setupStreamlitVoice() {
    // Custom event listener for Streamlit components
    window.addEventListener('message', (event) => {
        const data = event.data;
        
        if (data.type === 'START_RECORDING') {
            window.voiceInterface.startRecording().then(success => {
                window.parent.postMessage({
                    type: 'RECORDING_STATUS',
                    status: success ? 'recording' : 'error'
                }, '*');
            });
        }
        
        if (data.type === 'STOP_RECORDING') {
            window.voiceInterface.stopRecording().then(blob => {
                if (blob) {
                    window.voiceInterface.blobToBase64(blob).then(base64 => {
                        window.parent.postMessage({
                            type: 'AUDIO_DATA',
                            data: base64,
                            format: 'audio/wav'
                        }, '*');
                    });
                }
            });
        }
        
        if (data.type === 'PLAY_AUDIO' && data.data) {
            // Convert base64 back to blob
            const byteCharacters = atob(data.data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: data.format || 'audio/wav' });
            
            window.voiceInterface.playAudio(blob);
        }
        
        if (data.type === 'TEXT_TO_SPEECH' && data.text) {
            window.voiceInterface.speak(data.text, data.lang);
        }
    });
}

// Initialize when in Streamlit environment
if (window.parent !== window) {
    setupStreamlitVoice();
}