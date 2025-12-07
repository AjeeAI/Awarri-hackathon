import uvicorn
from fastapi import FastAPI
from fastapi.responses import FileResponse
from main import translate, translate_and_speak
from pydantic import BaseModel

app = FastAPI(version = "1.0.0")

class DefinePrompt(BaseModel):
    user_prompt: str
    language: str

@app.get("/")
def home():
    return {"Message": "Welcome to our app"}

@app.post("/translate_hausa")
def translate_engish(requests: DefinePrompt):
    user_prompt = requests.user_prompt
    language = requests.language
    result = translate_and_speak(user_prompt, language, "translation_audio.wav")

    audio_path = result["audio_file"]

    return FileResponse(
        audio_path,
        media_type="audio/wav",
        filename="translation_audio.wav"
    )

if __name__ == "__main__":
    uvicorn.run(app = app, host="127.0.0.1", port=8000)
