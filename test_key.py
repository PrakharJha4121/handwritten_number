import os
from dotenv import load_dotenv

# 1. Force load the .env file
load_dotenv()

# 2. Try to grab the variable
api_key = os.getenv("GEMINI_API_KEY")

# 3. Check results
print("--- DEBUG RESULTS ---")
if api_key:
    # We only print the first 5 characters to verify it's the right one
    print(f"✅ SUCCESS: API Key found! It starts with: {api_key[:5]}...")
else:
    print("❌ ERROR: API Key is None. The .env file is likely named wrong or in the wrong folder.")
print("---------------------")
