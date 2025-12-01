import cv2
import numpy as np
from PIL import Image

def preprocess_image(image_array, target_size=(224, 224)):
    """
    Preprocess the fundus image for model prediction
    """
    # Convert to RGB if needed
    if len(image_array.shape) == 2:  # Grayscale
        image_array = cv2.cvtColor(image_array, cv2.COLOR_GRAY2RGB)
    elif image_array.shape[2] == 4:  # RGBA
        image_array = cv2.cvtColor(image_array, cv2.COLOR_RGBA2RGB)
    
    # Resize image
    image_array = cv2.resize(image_array, target_size)
    
    # Normalize pixel values
    image_array = image_array.astype(np.float32) / 255.0
    
    return image_array

def enhance_image(image_array):
    """
    Enhance fundus image quality using various techniques
    """
    # Convert to appropriate color space
    lab = cv2.cvtColor(image_array, cv2.COLOR_RGB2LAB)
    
    # CLAHE (Contrast Limited Adaptive Histogram Equalization)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    lab[:,:,0] = clahe.apply(lab[:,:,0])
    
    # Convert back to RGB
    enhanced = cv2.cvtColor(lab, cv2.COLOR_LAB2RGB)
    
    # Gaussian blur to reduce noise
    enhanced = cv2.GaussianBlur(enhanced, (3,3), 0)
    
    return enhanced

def extract_roi(image_array):
    """
    Extract Region of Interest (ROI) from fundus image
    """
    # Convert to grayscale for processing
    gray = cv2.cvtColor(image_array, cv2.COLOR_RGB2GRAY)
    
    # Apply threshold to create mask
    _, mask = cv2.threshold(gray, 10, 255, cv2.THRESH_BINARY)
    
    # Find contours
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    if contours:
        # Get the largest contour (assumed to be the retina)
        largest_contour = max(contours, key=cv2.contourArea)
        
        # Create mask from contour
        mask = np.zeros_like(gray)
        cv2.drawContours(mask, [largest_contour], -1, 255, -1)
        
        # Apply mask to original image
        result = cv2.bitwise_and(image_array, image_array, mask=mask)
        return result
    
    return image_array