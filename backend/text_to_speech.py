from google import genai
from google.genai import types
from dotenv import load_dotenv
load_dotenv()
import os


api_key = os.getenv("GEMINI_API_KEY")

# Initialize client
client = genai.Client(api_key=api_key)

try:
    print("Requesting audio stream...")
    
    # Use the experimental 2.0 model which has confirmed Audio Gen support
    response_stream = client.models.generate_content_stream(
        model="gemini-2.0-flash-exp", 
        contents="Explain quantum physics in one sentence.",
        config=types.GenerateContentConfig(
            response_modalities=["AUDIO"]
        )
    )

    print("Streaming audio...")

    with open("streamed_output.wav", "wb") as f:
        for chunk in response_stream:
            # Check for candidates and parts
            if chunk.candidates:
                for part in chunk.candidates[0].content.parts:
                    if part.inline_data:
                        f.write(part.inline_data.data)
                        print(".", end="", flush=True)

    print("\nStreaming complete! Saved to streamed_output.wav")

except Exception as e:
    print(f"\nAn error occurred: {e}")