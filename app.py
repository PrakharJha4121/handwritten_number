from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import google.generativeai as genai
from PIL import Image
import io

load_dotenv()

app = Flask(__name__)
# Allow CORS for all domains to prevent frontend connection errors
CORS(app)

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    print("Error: GEMINI_API_KEY not found in .env file")

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
        
        # Read and process image using PIL
        # We don't need manual base64 encoding; the SDK handles PIL images directly
        image_data = file.read()
        image = Image.open(io.BytesIO(image_data))
        
        # Use the newer, faster model (gemini-pro-vision is deprecated)
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        prompt = """Look at this image and identify the handwritten digit(s). 
        Respond with ONLY the digit itself (e.g., "7"). 
        If you are unsure, say "Could not identify". 
        Do not provide JSON, just the plain text result."""
        
        # FIXED: Removed space between model. and generate_content
        # simplified call: passing the PIL image object directly handles PNG/JPG automatically
        response = model.generate_content([prompt, image])
        
        # Parse response
        result_text = response.text.strip()
        
        return jsonify({
            "success": True,
            "result": result_text,
            "message": "Digit identified successfully"
        }), 200
    
    except Exception as e:
        print(f"Error: {str(e)}") # Print error to terminal for debugging
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
