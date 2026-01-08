import os
import json
import asyncio
import edge_tts
from google import genai
from google.genai import types
from pathlib import Path
from dotenv import load_dotenv
from pydub import AudioSegment, silence

# Load environment variables
load_dotenv()

# Configuration
NUMBER_OF_TIPS = 5
TOPIC = "Advanced Python Tricks"
AUDIO_OUTPUT_DIR = "public/audio"
DATA_OUTPUT_PATH = "src/data/tips.json"
VOICE = "en-US-ChristopherNeural" 

async def generate_tips():
    print(f"🧠 Generating {NUMBER_OF_TIPS} engagement-optimized tips for: {TOPIC}...")

    client = genai.Client(
        api_key=os.getenv("GEMINI_API_KEY"),
        http_options={'api_version': 'v1beta'}
    )

    # 🧨 UPDATED PROMPT: Added "Easter Egg" and "Infinite Loop" constraints
    prompt = f"""
    You are a viral content strategist for a coding channel.
    Generate {NUMBER_OF_TIPS} extremely engaging Python tips about "{TOPIC}".

    STRICT RULES FOR THE SCRIPT (The "Loop" Technique):
    1. THE HOOK (0-3s): Must be a "Negative Constraint" or "Specific Outcome".
       - Example: "Stop using range(len). It is messy."
    2. THE BODY: Explain the solution fast.
    3. THE LOOP (The End): The script MUST end with a sentence fragment that connects perfectly back to the start.
       - Example End: "...and that is exactly..."
       - (Which loops back to Start: "why you should stop using...")
       - Make sure the audio ending feels unresolved so the loop resolves it.

    STRICT RULES FOR THE CODE (The "Easter Egg" Technique):
    1. PRODUCTION SNIPPET: Must be realistic, professional code.
    2. THE BAIT: Inside the 'production_snippet', hide ONE small, funny, or relatable comment.
       - Examples: "# TODO: Fix this before boss sees", "# I have no idea why this works", "# please dont touch", "# temporary fix (since 2015)"
       - This forces viewers to comment "Did anyone see that comment? 😂".

    Return a JSON object with this exact schema:
    {{
        "tips": [
            {{
                "id": "tip_unique_id",
                "title": "JUNIOR VS SENIOR", 
                "code_snippet": "The 'Junior' code example (keep it short/bad)",
                "production_snippet": "The 'Senior' code with the hidden funny comment", 
                "script": "Spoken script under 20 seconds. Punchy. Ends with a loop fragment."
            }}
        ]
    }}
    """

    try:
        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type='application/json'
            )
        )
        
        data = json.loads(response.text)
        tips = data['tips']
        print(f"✅ Received {len(tips)} viral hooks from Gemini.")
        
    except Exception as e:
        print("❌ Error parsing Gemini JSON:", e)
        return

    # 2. Generate Audio & Post-Process
    os.makedirs(AUDIO_OUTPUT_DIR, exist_ok=True)
    print(f"🎙️ Generating Audio files...")
    
    for i, tip in enumerate(tips):
        safe_id = f"tip_{i:02d}"
        tip['id'] = safe_id
        filename = f"{safe_id}.mp3"
        output_path = Path(AUDIO_OUTPUT_DIR) / filename
        
        # Generate Raw TTS
        communicate = edge_tts.Communicate(tip['script'], VOICE)
        await communicate.save(output_path)
        
        # ✂️ Silence Removal
        try:
            audio = AudioSegment.from_mp3(output_path)
            chunks = silence.split_on_silence(
                audio,
                min_silence_len=300,
                silence_thresh=audio.dBFS - 16,
                keep_silence=100
            )
            processed_audio = sum(chunks) if chunks else audio
            processed_audio.export(output_path, format="mp3")
            
            duration_sec = len(processed_audio) / 1000.0
            tip['audio_duration'] = duration_sec
            tip['audio_path'] = f"/audio/{filename}"
            
            print(f"   -> Processed: {filename} ({duration_sec}s)")
            
        except Exception as e:
            print(f"   ⚠️ Error processing audio for {filename}: {e}")
            tip['audio_duration'] = 0 
            tip['audio_path'] = f"/audio/{filename}"

    # 3. Save Manifest
    os.makedirs(os.path.dirname(DATA_OUTPUT_PATH), exist_ok=True)
    with open(DATA_OUTPUT_PATH, "w") as f:
        json.dump(tips, f, indent=2)
    
    print(f"🚀 Success! Engagement-optimized data saved to {DATA_OUTPUT_PATH}")

if __name__ == "__main__":
    asyncio.run(generate_tips())