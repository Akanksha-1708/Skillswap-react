from fastapi import FastAPI, HTTPException
from firebase_config import db

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity


app = FastAPI(
    title="SkillSwap AI Recommendation API",
    description="AI-powered skill matching service for SkillSwap",
    version="1.0.0",
)


# Load the embedding model once when the server starts.
model = SentenceTransformer("all-MiniLM-L6-v2")


@app.get("/")
def root():
    return {
        "message": "SkillSwap AI Recommendation API is running"
    }


def create_text(skills):
    """
    Convert a list of skills into text that can be
    understood by the embedding model.
    """
    if not skills:
        return ""

    return ", ".join(skills)


def calculate_similarity(text_a, text_b):
    """
    Generate embeddings for two pieces of text
    and return their cosine similarity as a percentage.
    """

    if not text_a or not text_b:
        return 0.0

    embedding_a = model.encode([text_a])
    embedding_b = model.encode([text_b])

    similarity = cosine_similarity(
        embedding_a,
        embedding_b
    )[0][0]
    score=max(0,float(similarity)*100)
    return round(score, 2)

@app.get("/recommendations/{user_id}")
def get_recommendations(user_id: str):

    user_ref = db.collection("users").document(user_id)
    user_snapshot = user_ref.get()

    if not user_snapshot.exists:
        raise HTTPException(
            status_code=404,
            detail="User profile not found"
        )

    current_user = user_snapshot.to_dict()

    current_learning = create_text(
        current_user.get("learningSkills", [])
    )

    current_teaching = create_text(
        current_user.get("teachingSkills", [])
    )

    users = db.collection("users").stream()

    candidates = []

    for user in users:

        if user.id == user_id:
            continue

        candidate = user.to_dict()

        candidate_teaching = create_text(
            candidate.get("teachingSkills", [])
        )

        candidate_learning = create_text(
            candidate.get("learningSkills", [])
        )

        candidates.append({
            "uid": user.id,
            "fullName": candidate.get("fullName"),
            "email": candidate.get("email"),
            "teachingSkills": candidate.get(
                "teachingSkills", []
            ),
            "learningSkills": candidate.get(
                "learningSkills", []
            ),
            "candidateTeaching": candidate_teaching,
            "candidateLearning": candidate_learning,
        })
    
    if not candidates:
        return{
            "userId":user_id,
            "recommendations":[]
        }

    learning_texts = [
        candidate["candidateTeaching"]
        for candidate in candidates
    ]

    teaching_texts = [
        candidate["candidateLearning"]
        for candidate in candidates
    ]

    current_learning_embedding = model.encode(
        [current_learning]
    )

    current_teaching_embedding = model.encode(
        [current_teaching]
    )

    candidate_teaching_embeddings = model.encode(
        learning_texts
    )

    candidate_learning_embeddings = model.encode(
        teaching_texts
    )

    learning_similarities = cosine_similarity(
        current_learning_embedding,
        candidate_teaching_embeddings
    )[0]

    teaching_similarities = cosine_similarity(
        current_teaching_embedding,
        candidate_learning_embeddings
    )[0]

    recommendations = []

    for index, candidate in enumerate(candidates):

        learning_match = max(
            0,
            round(
                float(learning_similarities[index]) * 100,
                2
            )
        )

        teaching_match = max(
            0,
            round(
                float(teaching_similarities[index]) * 100,
                2
            )
        )

        final_score = round(
            (learning_match + teaching_match) / 2,
            2
        )

        recommendations.append({
            "uid": candidate["uid"],
            "fullName": candidate["fullName"],
            "email": candidate["email"],
            "teachingSkills": candidate["teachingSkills"],
            "learningSkills": candidate["learningSkills"],
            "learningMatch": learning_match,
            "teachingMatch": teaching_match,
            "score": final_score,
        })

    recommendations.sort(
        key=lambda user: user["score"],
        reverse=True
    )

    return {
        "userId": user_id,
        "recommendations": recommendations,
    }