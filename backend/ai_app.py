import uvicorn
from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from main import text_to_speech, translate, translate_and_speak
from pydantic import BaseModel
from pyngrok import ngrok
from dotenv import load_dotenv
import os
from api import router as curriculum_router
from api import router as lesson_router
from api import router as practice_router
from api import router as evaluate_router
from api import router as progress_router
load_dotenv()

app = FastAPI(version = "1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    # "https://b8f970cf0fe3.ngrok-free.app",
    "http://localhost:5173",
    "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DefinePrompt(BaseModel):
    user_prompt: str
    language: str

@app.get("/")
def home():
    return {"Message": "Welcome to our AwaSabi"}

@app.post("/english_translator")
def translate_engish(requests: DefinePrompt):
    user_prompt = requests.user_prompt
    language = requests.language
    result = translate(user_prompt, language)
    return {"Translation": result}


# @app.post("/english_translator_voice")
# def translate_engish_voice(requests: DefinePrompt):
#     user_prompt = requests.user_prompt
#     language = requests.language
#     result = translate_and_speak(user_prompt, language, "translation_audio.wav")

#     audio_path = result["audio_file"]

#     return FileResponse(
#         audio_path,
#         media_type="audio/wav",
#         filename="translation_audio.wav"
#     )


class SpeakRequest(BaseModel):
    text: str       # Matches 'text' in React
    language: str   # Matches 'language' in React

@app.post("/english_translator_voice")
async def english_translator_voice(request: SpeakRequest, background_tasks: BackgroundTasks):
    try:
        # 1. Direct Text-to-Speech (No Translation step needed)
        # We pass the translated text directly to the TTS model
        audio_path = text_to_speech(request.text, request.language)
        
        # 2. Schedule file deletion (Cleanup)
        # This deletes the file after the response is sent to save disk space
        background_tasks.add_task(os.remove, audio_path)

        # 3. Return the File Stream
        return FileResponse(
            path=audio_path, 
            media_type="audio/wav", 
            filename="speech.wav"
        )

    except Exception as e:
        # Log the error for debugging
        print(f"Error generating audio: {e}")
        raise HTTPException(status_code=500, detail=str(e))

app.include_router(curriculum_router, prefix="/api")
app.include_router(lesson_router, prefix="/api")
app.include_router(practice_router, prefix="/api")
app.include_router(progress_router, prefix="/api")
app.include_router(evaluate_router, prefix="/api")
# token = os.getenv("AUTH_TOKEN")
# ngrok.set_auth_token(token)

# public_url = ngrok.connect(8000)
# print("Public URL:", public_url)

if __name__ == "__main__":
    uvicorn.run(app = app, host="127.0.0.1", port=8000)