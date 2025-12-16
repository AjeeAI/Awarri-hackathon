import os
import torch
import re
import json
import uuid
import warnings
import soundfile as sf
from datetime import datetime
from transformers import (
    AutoTokenizer, 
    AutoModelForCausalLM, 
    BitsAndBytesConfig, 
    AutoProcessor, 
    VitsModel
)

warnings.filterwarnings("ignore")

# ------------------------- GLOBAL CONFIG -------------------------
MODEL_NAME = "NCAIR1/N-ATLaS"
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Global variables for caching the LLM
llm_model = None
llm_tokenizer = None

# ------------------------- INITIALIZATION -------------------------

def initialize_model():
    """Initialize N-ATLaS model with 4-bit quantization."""
    global llm_model, llm_tokenizer
    
    if llm_model is not None:
        return llm_model, llm_tokenizer  # Return cached model

    print(f"Initializing N-ATLaS model on {DEVICE}...")
    torch.cuda.empty_cache()

    # Quantization config for efficiency
    bnb_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_compute_dtype=torch.bfloat16,
        bnb_4bit_use_double_quant=True,
        llm_int8_enable_fp32_cpu_offload=True
    )

    llm_tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    llm_model = AutoModelForCausalLM.from_pretrained(
        MODEL_NAME,
        quantization_config=bnb_config,
        trust_remote_code=True,
        device_map="auto"
    )

    print("N-ATLaS Model Loaded Successfully!")
    return llm_model, llm_tokenizer

# Load model immediately on start
initialize_model()

# ------------------------- HELPER FUNCTIONS -------------------------

def extract_assistant_response(text):
    """Extract the assistant’s reply from chat template output."""
    pattern = r"<\|start_header_id\|>assistant<\|end_header_id\|>\s*(.*?)<\|eot_id\|>"
    match = re.search(pattern, text, re.DOTALL)
    return match.group(1).strip() if match else text.strip()

def generate_llm_response(system_message, user_message, max_tokens=4096, temperature=0.7):
    """
    General purpose wrapper to generate text using N-ATLaS.
    """
    messages = [
        {"role": "system", "content": system_message},
        {"role": "user", "content": user_message}
    ]

    current_date = datetime.now().strftime("%d %b %Y")

    # Format inputs
    text = llm_tokenizer.apply_chat_template(
        messages,
        add_generation_prompt=True,
        tokenize=False,
        date_string=current_date
    )

    tokens = llm_tokenizer(text, return_tensors="pt", add_special_tokens=False)
    tokens = {k: v.to(llm_model.device) for k, v in tokens.items()}

    # Generate
    outputs = llm_model.generate(
        **tokens,
        max_new_tokens=max_tokens,
        temperature=temperature,
        do_sample=True,
        repetition_penalty=1.12
    )

    decoded = llm_tokenizer.batch_decode(outputs)[0]
    return extract_assistant_response(decoded)

def parse_json_from_text(text: str):
    """
    Robustly extracts JSON, handling Llama-3 artifacts, comments, 
    and common syntax errors.
    """
    try:
        # Attempt 1: Direct Parse
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Pre-processing: Remove C-style comments // ... which break JSON
    text_clean = re.sub(r"//.*", "", text)
    
    try:
        # Attempt 2: Parse cleaned text
        return json.loads(text_clean)
    except json.JSONDecodeError:
        pass

    try:
        # Attempt 3: Regex to find the main JSON block {} or []
        match = re.search(r"(\{.*\}|\[.*\])", text_clean, re.DOTALL)
        if match:
            json_str = match.group(0)
            return json.loads(json_str)
    except json.JSONDecodeError:
        pass

    # Attempt 4: Fail gracefully
    print(f"JSON Parsing Failed. Raw output snippet: {text[:100]}...")
    return None
# ------------------------- TRANSLATION & SPEECH -------------------------

def translate(user_prompt, language):
    """
    Translates English text to the target language using N-ATLaS.
    """
    # 1. Correct English grammar first (optional, but improves quality)
    grammar_sys = "You are an English grammar expert. Rewrite the input into clear, correct English. Output ONLY the corrected sentence."
    corrected_text = generate_llm_response(grammar_sys, user_prompt, max_tokens=200, temperature=0.1)

    # 2. Translate
    translate_sys = f"""
    You are a language expert in {language} and English.
    Translate the user input from English to {language}.
    Be precise. Do not provide explanations, just the translation.
    """
    
    translation = generate_llm_response(translate_sys, corrected_text, max_tokens=500, temperature=0.1)
    
    # Cleanup any "Here is the translation:" artifacts if present
    if ":" in translation and len(translation.split(":")[0]) < 30:
        translation = translation.split(":", 1)[1].strip()
        
    return translation

def text_to_speech(text, language, output_dir="temp_audio"):
    """
    Generates audio from text using Facebook MMS models.
    """
    os.makedirs(output_dir, exist_ok=True)
    filename = f"audio_{uuid.uuid4()}.wav"
    output_path = os.path.join(output_dir, filename)

    # Select model based on language
    lang_map = {
        "yoruba": "facebook/mms-tts-yor",
        "igbo": "facebook/mms-tts-ibo_ng",
        "hausa": "facebook/mms-tts-hau"
    }
    
    tts_model_name = lang_map.get(language.lower())
    if not tts_model_name:
        raise ValueError(f"Unsupported language for TTS: {language}")

    # Load TTS model (Note: For production, load these globally to avoid reloading per request)
    processor = AutoProcessor.from_pretrained(tts_model_name)
    model_tts = VitsModel.from_pretrained(tts_model_name).to(DEVICE)

    inputs = processor(text=text, return_tensors="pt").to(DEVICE)

    with torch.no_grad():
        outputs = model_tts(**inputs)
        audio = outputs.waveform.squeeze().cpu().numpy()

    sf.write(output_path, audio, 16000)
    return output_path

def translate_and_speak(user_prompt, language, tts_file="translation_audio.wav"):
    """
    Orchestrator for translation + TTS.
    """
    translation = translate(user_prompt, language)
    audio_path = text_to_speech(translation, language)
    
    return {
        "translation_text": translation,
        "audio_file": audio_path
    }

# ------------------------- CURRICULUM LOGIC -------------------------

def generate_curriculum(age, proficiency, target_language,
                        native_language="English", weeks=4,
                        goals=None):
    if goals is None:
        goals = []

    # STRICT SYSTEM PROMPT
    system_msg = (
        f"You are an expert {target_language} curriculum designer. "
        f"The learner's native language is {native_language}. "
        f"You MUST return valid, parseable JSON only. "
        f"Do NOT use markdown. Do NOT use comments like // or #. "
        f"Do NOT use placeholders like '...'. You must generate the FULL content."
    )

    goals_text = f"Focus: {', '.join(goals)}" if goals else ""

    # UPDATED USER PROMPT
    user_msg = f"""
    Create a {weeks}-week curriculum for learning {target_language}.
    Learner Age: {age}, Proficiency: {proficiency}
    {goals_text}

    **STRICT OUTPUT RULES:**
    1. Return ONLY valid JSON.
    2. Do NOT truncate the response. Generate ALL {weeks} weeks.
    3. Do NOT use comments (e.g. // ... other weeks).
    4. Ensure all quotes " are closed properly.

    JSON Structure:
    {{
      "overview": "Overview in {native_language}",
      "weeks": [
          {{
            "week": 1,
            "theme": "...",
            "objectives": "...",
            "sessions": [
                {{"session": 1, "topic": "...", "activities": "..."}},
                {{"session": 2, "topic": "...", "activities": "..."}},
                {{"session": 3, "topic": "...", "activities": "..."}}
            ]
          }}
          // ... Generate objects for all {weeks} weeks here ...
      ],
      "milestones": ["Milestone 1", "Milestone 2"]
    }}
    """

    # Generate with lower temperature for structural stability
    raw_response = generate_llm_response(system_msg, user_msg, temperature=0.3)
    
    parsed_data = parse_json_from_text(raw_response)

    if not parsed_data:
        return {
            "error": "Failed to parse curriculum",
            "details": "The model produced invalid JSON.",
            "raw_text": raw_response
        }
        
    return parsed_data
# ------------------------- LESSON CONTENT -------------------------

def get_lesson_content(target_language="English", week=1, day=1,
                       theme="Greetings", proficiency="beginner",
                       native_language="English"):

    system_msg = (
        f"You are an expert {target_language} teacher. "
        f"Respond with valid JSON only. No markdown."
    )

    user_msg = f"""
    Create a lesson for Week {week}, Day {day}, Theme: {theme}, Level: {proficiency}.
    
    Return JSON with:
    - vocabulary (list of {{word, explanation}})
    - grammar (string explanation)
    - key_phrases (list of phrases)
    - activities (list of instructions)
    - cultural_tip (string)
    """

    response = generate_llm_response(system_msg, user_msg, max_tokens=1500)
    parsed_data = parse_json_from_text(response)

    if not parsed_data:
        return {"error": "Failed to parse lesson", "raw_text": response}
    return parsed_data

# ---------------------- PRACTICE GENERATION ----------------------

def generate_practice(target_language="English", exercise_type="vocabulary",
                      difficulty="beginner", topic="Greetings", count=5,
                      native_language="English"):

    system_msg = f"You create {target_language} exercises. Return a valid JSON array only."

    user_msg = f"""
    Generate {count} multiple-choice questions (MCQ) on '{topic}' for {difficulty} learners.
    
    Return a JSON ARRAY where each item is:
    {{
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correct_answer": "Option Letter or Text",
      "explanation": "..."
    }}
    """

    response = generate_llm_response(system_msg, user_msg)
    parsed_data = parse_json_from_text(response)
    
    if not parsed_data:
        return {"error": "Failed to parse practice", "raw_text": response}
    return parsed_data

# ----------------------- EVALUATION -----------------------

def evaluate_answer(question, user_answer, correct_answer,
                    target_language="English", native_language="English"):

    system_msg = f"You are a {target_language} tutor. Return valid JSON only."

    user_msg = f"""
    Evaluate this answer.
    Question: {question}
    User Answer: {user_answer}
    Correct Answer: {correct_answer}

    Return JSON:
    {{
      "is_correct": boolean,
      "score": int (0-100),
      "feedback": "string in {native_language}",
      "corrections": "string",
      "encouragement": "string"
    }}
    """

    response = generate_llm_response(system_msg, user_msg)
    parsed_data = parse_json_from_text(response)
    
    if not parsed_data:
        return {"error": "Failed to parse evaluation", "raw_text": response}
    return parsed_data

# ----------------------- PROGRESS SUMMARY -----------------------

def get_progress_summary(target_language="English", completed_lessons=0,
                         total_xp=0, streak_days=0, weak_areas=None,
                         native_language="English"):

    if weak_areas is None: weak_areas = []

    system_msg = "You are a learning advisor. Return valid JSON only."

    user_msg = f"""
    Analyze progress:
    Lessons: {completed_lessons}, XP: {total_xp}, Streak: {streak_days}
    Weaknesses: {', '.join(weak_areas)}

    Return JSON:
    {{
      "progress_level": "string",
      "insights": "string in {native_language}",
      "recommendations": ["rec1", "rec2"],
      "next_milestone": "string"
    }}
    """

    response = generate_llm_response(system_msg, user_msg)
    parsed_data = parse_json_from_text(response)
    
    if not parsed_data:
        return {"error": "Failed to parse progress", "raw_text": response}
    return parsed_data