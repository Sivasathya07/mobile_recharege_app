class RetinalDiseaseDetector {
    constructor() {
        this.API_BASE_URL = 'http://localhost:5000/api';
        this.currentImage = null;
        this.initializeEventListeners();
        this.testConnection();
    }

    async testConnection() {
        try {
            const response = await fetch(`${this.API_BASE_URL}/health`);
            const data = await response.json();
            console.log('✅ Backend connection successful:', data);
            this.showNotification('Backend connected successfully!', 'success');
        } catch (error) {
            console.error('❌ Backend connection failed:', error);
            this.showNotification('Cannot connect to backend. Make sure the server is running on port 5000.', 'error');
        }
    }

    initializeEventListeners() {
        const uploadArea = document.getElementById('uploadArea');
        const imageInput = document.getElementById('imageInput');
        const analyzeBtn = document.getElementById('analyzeBtn');
        const newAnalysisBtn = document.getElementById('newAnalysisBtn');

        uploadArea.addEventListener('click', () => imageInput.click());
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#667eea';
            uploadArea.style.background = '#f0f3ff';
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = '#ddd';
            uploadArea.style.background = '';
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#ddd';
            uploadArea.style.background = '';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleImageSelection(files[0]);
            }
        });

        imageInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleImageSelection(e.target.files[0]);
            }
        });

        analyzeBtn.addEventListener('click', () => this.analyzeImage());
        newAnalysisBtn.addEventListener('click', () => this.resetAnalysis());
    }

    handleImageSelection(file) {
        if (!file.type.match('image.*')) {
            this.showNotification('Please select a valid image file (JPEG, PNG).', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.currentImage = file;
            this.displayPreviewImage(e.target.result);
            document.getElementById('analyzeBtn').disabled = false;
        };
        reader.readAsDataURL(file);
    }

    displayPreviewImage(imageData) {
        const previewImage = document.getElementById('previewImage');
        const uploadPlaceholder = document.querySelector('.upload-placeholder');

        previewImage.src = imageData;
        previewImage.style.display = 'block';
        uploadPlaceholder.style.display = 'none';
    }

    async analyzeImage() {
        if (!this.currentImage) {
            this.showNotification('Please select an image first.', 'error');
            return;
        }

        this.showLoading(true);

        try {
            const formData = new FormData();
            formData.append('image', this.currentImage);

            console.log('📤 Sending image for analysis...');
            
            const response = await fetch(`${this.API_BASE_URL}/predict`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('📥 Received analysis result:', result);

            if (result.success) {
                this.displayResults(result);
                this.showNotification('Analysis completed successfully!', 'success');
            } else {
                throw new Error(result.error || 'Analysis failed');
            }
        } catch (error) {
            console.error('Analysis error:', error);
            this.showNotification(`Analysis failed: ${error.message}`, 'error');
        } finally {
            this.showLoading(false);
        }
    }

    displayResults(result) {
        document.getElementById('uploadSection').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'block';

        document.getElementById('diseaseName').textContent = result.prediction.disease;
        document.getElementById('confidence').textContent = `Confidence: ${(result.prediction.confidence * 100).toFixed(1)}%`;
        document.getElementById('diseaseDescription').textContent = result.prediction.description;

        document.getElementById('resultImage').src = URL.createObjectURL(this.currentImage);

        this.updateList('treatmentsList', result.recommendations.treatments, 'fas fa-check-circle');
        this.updateList('emergencyList', result.recommendations.emergency_signs, 'fas fa-exclamation-circle');
        this.updateList('lifestyleList', result.recommendations.lifestyle_tips, 'fas fa-heart');
        
        document.getElementById('followUpPlan').textContent = result.recommendations.follow_up;

        document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
    }

    updateList(elementId, items, iconClass) {
        const container = document.getElementById(elementId);
        container.innerHTML = '';

        if (items && items.length > 0) {
            items.forEach(item => {
                const div = document.createElement('div');
                div.innerHTML = `<i class="${iconClass}"></i><span>${item}</span>`;
                container.appendChild(div);
            });
        } else {
            container.innerHTML = '<div>No specific recommendations</div>';
        }
    }

    resetAnalysis() {
        document.getElementById('imageInput').value = '';
        document.getElementById('previewImage').style.display = 'none';
        document.getElementById('previewImage').src = '';
        document.querySelector('.upload-placeholder').style.display = 'block';
        document.getElementById('analyzeBtn').disabled = true;
        
        document.getElementById('uploadSection').style.display = 'block';
        document.getElementById('resultsSection').style.display = 'none';
        
        this.currentImage = null;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    showLoading(show) {
        document.getElementById('loadingOverlay').style.display = show ? 'flex' : 'none';
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#3498db'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1001;
            max-width: 400px;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas ${type === 'error' ? 'fa-exclamation-triangle' : type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new RetinalDiseaseDetector();
});