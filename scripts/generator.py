import os
import json
import asyncio
import edge_tts
from google import genai
from google.genai import types
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
NUMBER_OF_TIPS = 5
TOPIC = "Advanced Python Tricks"
AUDIO_OUTPUT_DIR = "public/audio"
DATA_OUTPUT_PATH = "src/data/tips.json"
VOICE = "en-US-ChristopherNeural" 

async def generate_tips():
    print(f"🧠 Generating {NUMBER_OF_TIPS} tips for: {TOPIC}...")

    # 1. Setup New Gemini Client
    # We use v1beta to ensure access to the newest 2.0 models
    client = genai.Client(
        api_key=os.getenv("GEMINI_API_KEY"),
        http_options={'api_version': 'v1beta'}
    )

    prompt = f"""
    You are a senior developer creating viral content for Instagram Reels.
    Generate {NUMBER_OF_TIPS} tips about "{TOPIC}".
    
    Return a JSON object with this exact schema:
    {{
        "tips": [
            {{
                "id": "tip_unique_id",
                "title": "Short Hook Title (Max 5 words)",
                "code_snippet": "Actual code example (keep it short)",
                "script": "Spoken script under 30 seconds"
            }}
        ]
    }}
    """

    try:
        # UPDATED: Using 'gemini-2.0-flash' based on your available models list
        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type='application/json'
            )
        )
        
        # Parse JSON
        data = json.loads(response.text)
        tips = data['tips']
        print(f"✅ Received {len(tips)} tips from Gemini.")
        
    except Exception as e:
        print("❌ Error parsing Gemini JSON:", e)
        return

    # 2. Generate Audio
    os.makedirs(AUDIO_OUTPUT_DIR, exist_ok=True)
    
    print(f"🎙️ Generating Audio files...")
    
    for i, tip in enumerate(tips):
        # Create safe ID
        safe_id = f"tip_{i:02d}"
        tip['id'] = safe_id
        
        filename = f"{safe_id}.mp3"
        output_path = Path(AUDIO_OUTPUT_DIR) / filename
        
        # Path for Remotion
        tip['audio_path'] = f"/audio/{filename}"

        # Generate Audio
        communicate = edge_tts.Communicate(tip['script'], VOICE)
        await communicate.save(output_path)
        
        print(f"   -> Generated: {filename}")

    # 3. Save Manifest
    os.makedirs(os.path.dirname(DATA_OUTPUT_PATH), exist_ok=True)
    with open(DATA_OUTPUT_PATH, "w") as f:
        json.dump(tips, f, indent=2)
    
    print(f"🚀 Success! Data saved to {DATA_OUTPUT_PATH}")

if __name__ == "__main__":
    asyncio.run(generate_tips())