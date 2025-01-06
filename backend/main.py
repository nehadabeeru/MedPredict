from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel, Field
import json
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import faiss
import logging
from sentence_transformers import SentenceTransformer
from torch.nn.functional import softmax

# Initialize FastAPI application
app = FastAPI()

# CORS middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# File paths
MODEL_PATH = "model/pubmedbert"
INDEX_PATH = "model/faiss_index.bin"
SUMMARIES_PATH = "data/formatted_patient_summaries.json"

# Load models, tokenizer, FAISS index, and summaries
try:
    embedding_model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
    index = faiss.read_index(INDEX_PATH)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
    model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH).to(device)
    logger.info("Model, tokenizer, and FAISS index loaded successfully.")
except Exception as e:
    logger.error(f"Error loading model components: {e}")
    raise HTTPException(status_code=500, detail="Model initialization failed.")

try:
    with open(SUMMARIES_PATH, "r") as file:
        summaries = [entry["summary"] for entry in json.load(file)]
    logger.info("Patient summaries loaded successfully.")
except Exception as e:
    logger.error(f"Error loading summaries: {e}")
    summaries = []

class Query(BaseModel):
    text: str = Field(..., min_length=1, max_length=1000)

def retrieve_summaries(query, index, summaries, embedding_model, k=3):
    """Retrieve relevant summaries from FAISS index."""
    if not index or not summaries:
        logger.warning("FAISS index or summaries are not loaded. Skipping retrieval.")
        return []
    query_embedding = embedding_model.encode([query]).astype("float32")
    distances, indices = index.search(query_embedding, k)
    return [summaries[idx] for idx in indices[0] if idx < len(summaries)]

def generate_explanation(query, prediction, retrieved_summaries):
    """Generate detailed explanation based on retrieved summaries and prediction."""
    key_factors = [
        "Treatment history",
        "Length of stay",
        "Medication details",
    ]
    risk_status = "High Risk" if prediction == 1 else "Low Risk"
    similar_cases_outcome = "complications" if prediction == 1 else "no complications"

    explanation = {
        "prediction_text": f"The prediction is '{risk_status}' for readmission within 30 days.",
        "key_factors": key_factors,
        "similar_cases": [],
        "recommendations": [
            "Monitor the patient closely.",
            "Ensure adherence to treatment plans.",
            "Schedule regular follow-ups.",
        ],
    }

    if retrieved_summaries:
        for case in retrieved_summaries[:3]:  # Limit to 3 summaries
            truncated_case = case[:150] + "..." if len(case) > 150 else case
            explanation["similar_cases"].append(truncated_case)
    else:
        explanation["similar_cases"].append("No similar cases found in the database.")

    return explanation

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors for input."""
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": exc.body},
    )

@app.get("/")
async def root():
    """Health check endpoint."""
    return {"status": "ok", "message": "MedPredict API is running"}

@app.post("/predict")
async def predict(query: Query):
    """Prediction endpoint."""
    try:
        logger.info(f"Received query: {query.text}")

        if len(query.text.strip()) < 3:
            return {
                "message": "Your query is too short. Please provide more details for a prediction."
            }

        # Retrieve relevant summaries
        retrieved_summaries = retrieve_summaries(query.text, index, summaries, embedding_model)

        # Perform prediction
        inputs = tokenizer(query.text, truncation=True, padding=True, return_tensors="pt").to(device)
        with torch.no_grad():
            outputs = model(**inputs)
            probabilities = softmax(outputs.logits, dim=1)
        prediction = torch.argmax(probabilities, dim=1).item()
        prediction_probability = probabilities[0, 1].item()

        # Generate explanation
        explanation = generate_explanation(query.text, prediction, retrieved_summaries)

        response = {
            "prediction": "High Risk" if prediction == 1 else "Low Risk",
            "explanation": explanation,
            "probability": f"{prediction_probability * 100:.2f}%"
        }
        logger.info(f"Prediction generated: {response}")
        return response
    except Exception as e:
        logger.error(f"Error in prediction: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="An error occurred during the prediction process.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
