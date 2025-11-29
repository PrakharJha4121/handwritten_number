from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import google.generativeai as genai
from PIL import Image
import io
import base64

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

@app.route('/api/identify', methods=['POST'])
def identify_digit():
    """
    API endpoint to identify handwritten digits from uploaded images
    """
    try:
        # Check if image is in request
        if 'image' not in request.files:
            return jsonify({"error": "No image provided"}), 400
        
        file = request.files['image']
        
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        # Read and process image
        image_data = file.read()
        image = Image.open(io.BytesIO(image_data))
        
        # Prepare image for Gemini
        image_base64 = base64.standard_b64encode(image_data).decode('utf-8')
        
        # Call Gemini API
        model = genai.GenerativeModel('gemini-pro-vision')
        prompt = """Look at this image and identify any handwritten digit(s) visible in it. 
        Please respond with:
        1. The digit(s) you see (0-9)
        2. Your confidence level (0-1)
        3. Any other relevant information
        
        Format your response as JSON."""
        
        response = model. generate_content([
            prompt,
            {"mime_type": "image/jpeg", "data": image_base64}
        ])
        
        # Parse response
        result_text = response.text
        
        return jsonify({
            "success": True,
            "result": result_text,
            "message": "Digit identified successfully"
        }), 200
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({"status": "healthy"}), 200

@app.route('/', methods=['GET'])
def home():
    """Home endpoint"""
    return jsonify({"message": "Handwritten Number Identifier API v1.0"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
