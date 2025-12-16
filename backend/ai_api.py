# api.py

from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

from main import (
    generate_curriculum,
    get_lesson_content,
    generate_practice,
    evaluate_answer,
    get_progress_summary
)

app = FastAPI(
    title="AI Language Learning API",
    description="Curriculum, lessons, practice, evaluation, progress tracking",
    version="1.0"
)

router = APIRouter()
# ------------------------- CORS -------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------- ROOT -------------------------
@router.get("/")
def root():
    return {"message": "Language Learning API is running"}


# -------------------- CURRICULUM ENDPOINT --------------------
@router.post("/curriculum")
def curriculum(
    age: str,
    proficiency: str,
    target_language: str = "English",
    weeks: int = 4,
    goals: str = ""
):
    """
    Generate a curriculum.
    Native language forced to English for better understanding.
    """
    goal_list = [g.strip() for g in goals.split(",")] if goals else []

    result = generate_curriculum(
        age=age,
        proficiency=proficiency,
        target_language=target_language,
        native_language="English",
        weeks=weeks,
        goals=goal_list
    )

    return result


# ------------------------- LESSON ENDPOINT -------------------------
@router.get("/lesson")
def lesson(
    week: int = 1,
    day: int = 1,
    theme: str = "Greetings",
    target_language: str = "English",
    proficiency: str = "beginner"
):
    """
    Generate detailed lesson content.
    """
    return get_lesson_content(
        target_language=target_language,
        week=week,
        day=day,
        theme=theme,
        proficiency=proficiency
    )


# ------------------------- PRACTICE ENDPOINT -------------------------
@router.post("/practice")
def practice(
    target_language: str = "English",
    exercise_type: str = "vocabulary",
    difficulty: str = "beginner",
    topic: str = "Greetings",
    count: int = 5
):
    """
    Generate practice exercises.
    """
    return generate_practice(
        target_language=target_language,
        exercise_type=exercise_type,
        difficulty=difficulty,
        topic=topic,
        count=count
    )


# ------------------------- EVALUATION ENDPOINT -------------------------
@router.post("/evaluate")
def evaluate(
    question: str,
    user_answer: str,
    correct_answer: str
):
    """
    Evaluate a learner’s answer.
    Native language default is English.
    """
    return evaluate_answer(
        question=question,
        user_answer=user_answer,
        correct_answer=correct_answer,
        target_language="English"
    )


# ------------------------- PROGRESS ENDPOINT -------------------------
@router.get("/progress")
def progress(
    completed: int = 0,
    xp: int = 0,
    streak: int = 0,
    weak: str = ""
):
    """
    Summarize learner progress.
    """
    weak_list = [w.strip() for w in weak.split(",")] if weak else []

    return get_progress_summary(
        target_language="English",
        completed_lessons=completed,
        total_xp=xp,
        streak_days=streak,
        weak_areas=weak_list
    )
