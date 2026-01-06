import os
import json
import asyncio
import edge_tts
import google.generativeai as genai
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Configuration
NUMBER_OF_TIPS = 5
TOPIC = "Advanced Python Tricks"
AUDIO_OUTPUT_DIR = "public/audio"
DATA_OUTPUT_PATH = "src/data/tips.json"
VOICE = "en-US-ChristopherNeural" 

async def generate_tips():
    print(f"🧠 Generating {NUMBER_OF_TIPS} tips for: {TOPIC}...")

    # 1. Get Content from Gemini
    model = genai.GenerativeModel(
        "gemini-1.5-flash",
        generation_config={"response_mime_type": "application/json"}
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
        response = model.generate_content(prompt)
        data = json.loads(response.text)
        tips = data['tips']
        print(f"✅ Received {len(tips)} tips from Gemini.")
    except Exception as e:
        print("❌ Error parsing Gemini JSON. Response might be empty or blocked.", e)
        return

    # 2. Generate Audio
    os.makedirs(AUDIO_OUTPUT_DIR, exist_ok=True)
    
    print(f"🎙️ Generating Audio files...")
    
    for i, tip in enumerate(tips):
        # We enforce a clean ID to avoid filename issues
        safe_id = f"tip_{i:02d}"
        tip['id'] = safe_id
        
        filename = f"{safe_id}.mp3"
        output_path = Path(AUDIO_OUTPUT_DIR) / filename
        
        # Path relative to Remotion public folder
        tip['audio_path'] = f"/audio/{filename}"

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