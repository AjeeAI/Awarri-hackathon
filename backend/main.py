import torch
import warnings
from transformers import AutoProcessor, VitsModel
import soundfile as sf
torch.cuda.empty_cache()
warnings.filterwarnings("ignore")

import logging
logging.getLogger("transformers.generation.utils").setLevel(logging.ERROR)
logging.getLogger("transformers").setLevel(logging.ERROR)

from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
import torch
from datetime import datetime
import re

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model_name = "NCAIR1/N-ATLaS"

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.bfloat16,
    bnb_4bit_use_double_quant=True,
    llm_int8_enable_fp32_cpu_offload=True
)

# Load model and tokenizer
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    quantization_config=bnb_config,
    device_map=device,
    dtype=torch.bfloat16

)

print(model.hf_device_map)



def format_text_for_inference(messages):
    current_date = datetime.now().strftime('%d %b %Y')
    text= tokenizer.apply_chat_template(
        messages,
        add_generation_prompt=True,
        tokenize=False,
        date_string=current_date
    )
    return text



def correct_english(user_prompt):
    sys_instructions = """
        You are an English grammar expert.
        Rewrite the user's input into clear, correct, standard English.
        Preserve the meaning.
        Output ONLY the corrected sentence.
    """

    q_chat = [
        {'role':'system','content': sys_instructions},
        {'role': 'user', 'content': user_prompt}
    ]

    text = format_text_for_inference(q_chat)

    input_tokens = tokenizer(text,return_tensors='pt',add_special_tokens=False).to(device)
    outputs = model.generate(
        **input_tokens,
        max_new_tokens = 1000,
        use_cache=True,
        temperature = 0.01
    )

    text = tokenizer.batch_decode(outputs)[0]

    # extract assistant response
    pattern = r"<\|start_header_id\|>assistant<\|end_header_id\|>\s*(.*?)<\|eot_id\|>"
    match = re.search(pattern, text, re.DOTALL)

    if match:
        return match.group(1).strip()
    else:
        return user_prompt  # fallback


def translate(user_prompt, language):
    sys_instructions = f"""
        You are language expert and teacher in the following language: [{language}] and English. You are to
        follow the following instructions:
        
        1. Your role is to translate the user prompt from English to the given language {language}
        2. Be precise as much as possible.
        3. Do not give any explanations, just give answers

            """
    
    user_prompt = correct_english(user_prompt)
    q_chat = [
        {'role':'system','content': sys_instructions},
        {'role': 'user', 'content': user_prompt}
    ]

    text = format_text_for_inference(q_chat)

    input_tokens = tokenizer(text,return_tensors='pt',add_special_tokens=False).to(device)
    outputs = model.generate(
        **input_tokens,
        max_new_tokens = 1000,
        use_cache=True,
        repetition_penalty=1.12,
        temperature = 0.01
        )

    text = tokenizer.batch_decode(outputs)[0]


    pattern = r"<\|start_header_id\|>assistant<\|end_header_id\|>\s*(.*?)<\|eot_id\|>"
    match = re.search(pattern, text, re.DOTALL)

    if match:
        final_answer = match.group(1).strip()
        return final_answer
    else:
        return "Assistant response not found."


def text_to_speech(text, language, output_path="output.wav"):
    if language.lower() == "yoruba":
        TTS_MODEL_NAME = "facebook/mms-tts-yor"
    elif language.lower() == "igbo":
        TTS_MODEL_NAME = "facebook/mms-tts-ibo"
    elif language.lower() == "hausa":
        TTS_MODEL_NAME = "facebook/mms-tts-hau"
    else:
        raise ValueError(f"Unsupported language: {language}")
    tts_processor = AutoProcessor.from_pretrained(TTS_MODEL_NAME)
    tts_model = VitsModel.from_pretrained(TTS_MODEL_NAME)
    tts_model = tts_model.to("cuda")

    inputs = tts_processor(text=text, return_tensors="pt").to("cuda")

    with torch.no_grad():
        outputs = tts_model(**inputs)
        audio = outputs.waveform.squeeze().cpu().numpy()

    sf.write(output_path, audio, 16000)
    return output_path


def translate_and_speak(user_prompt, language, tts_file="translation_audio.wav"):
    # --- 1. TRANSLATE USING YOUR NATLAS FUNCTION ---
    translation = translate(user_prompt, language)   # <-- your existing N-ATLaS function

    # --- 2. TEXT → SPEECH ---
    audio_path = text_to_speech(translation, language, tts_file)

    return {
        "translation_text": translation,
        "audio_file": audio_path
    }

