import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

print("🔍 Checking available Gemini models...")
try:
    # List all models
    for model in client.models.list():
        print(f" - {model.name}")
except Exception as e:
    print(f"❌ Error listing models: {e}")