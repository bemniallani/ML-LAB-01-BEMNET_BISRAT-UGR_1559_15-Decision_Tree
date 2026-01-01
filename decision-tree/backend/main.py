from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np

# Initialize FastAPI app
app = FastAPI(title="Decision Tree Diabetes Predictor")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the Decision Tree model
try:
    model = joblib.load(r"C:\Users\786\Desktop\decision-tree\backend\model\decision_tree.joblib")
    print("✅ Decision Tree model loaded successfully!")
except Exception as e:
    print(f"❌ Error loading model: {e}")

# Define request body structure
class PatientData(BaseModel):
    Pregnancies: float
    Glucose: float
    BloodPressure: float
    SkinThickness: float
    Insulin: float
    BMI: float
    DiabetesPedigreeFunction: float
    Age: float

# Health check endpoint
@app.get("/")
def home():
    return {
        "message": "Decision Tree Diabetes Prediction API",
        "status": "active",
        "model": "Decision Tree Classifier",
        "endpoints": {
            "/health": "Check API health",
            "/predict": "POST - Make prediction"
        }
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "model_loaded": True}

# Prediction endpoint
@app.post("/predict")
def predict(data: PatientData):
    try:
        # Convert input to numpy array
        features = np.array([[
            data.Pregnancies,
            data.Glucose,
            data.BloodPressure,
            data.SkinThickness,
            data.Insulin,
            data.BMI,
            data.DiabetesPedigreeFunction,
            data.Age
        ]])
        
        # Make prediction
        prediction = model.predict(features)[0]
        probability = model.predict_proba(features)[0]
        
        result = {
            "prediction": int(prediction),
            "label": "Diabetic" if prediction == 1 else "Non-Diabetic",
            "probabilities": {
                "non_diabetic": float(probability[0]),
                "diabetic": float(probability[1])
            },
            "confidence": float(max(probability)),
            "model": "decision_tree"
        }
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)