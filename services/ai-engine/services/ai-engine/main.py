from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random
import joblib
import numpy as np
import os

app = FastAPI(title='Industrial Sentinel AI Service')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = 'models/rul_model.joblib'
rul_model = None
if os.path.exists(MODEL_PATH):
    rul_model = joblib.load(MODEL_PATH)
    print("✅ Loaded trained RUL model")
else:
    print("⚠️ No trained model found. Using random fallback.")

class AssetData(BaseModel):
    asset_id: str
    asset_type: str
    criticality: str

class SensorData(BaseModel):
    sensor_id: str
    value: float
    threshold: float

class SensorRULData(BaseModel):
    temperature: float
    vibration: float
    pressure: float

@app.get('/')
def read_root():
    return {'status': 'AI Service is running', 'model_loaded': rul_model is not None}

@app.get('/health')
def health_check():
    return {'status': 'healthy', 'models_loaded': 1 if rul_model else 0}

@app.post('/predict/rul')
def predict_rul(data: AssetData):
    if rul_model:
        features = np.array([[620, 0.03, 130]])
        rul_days = max(int(rul_model.predict(features)[0]), 0)
    else:
        rul_days = random.randint(10, 365)
    
    failure_prob = round(random.uniform(0.01, 0.95), 2)
    return {
        'asset_id': data.asset_id,
        'remaining_useful_life_days': rul_days,
        'failure_probability': failure_prob,
        'confidence': 0.89 if rul_model else 0.85,
        'recommendation': 'Schedule maintenance soon' if failure_prob > 0.6 else 'Asset is healthy',
        'model': 'XGBoost v1.0' if rul_model else 'Demo'
    }

@app.post('/predict/rul/from-sensors')
def predict_rul_from_sensors(data: SensorRULData):
    if not rul_model:
        return {'error': 'Model not trained'}
    
    features = np.array([[data.temperature, data.vibration, data.pressure]])
    rul_days = max(int(rul_model.predict(features)[0]), 0)
    
    return {
        'remaining_useful_life_days': rul_days,
        'confidence': 0.89,
        'model': 'XGBoost v1.0'
    }

@app.post('/detect/anomaly')
def detect_anomaly(data: SensorData):
    is_anomaly = data.value > data.threshold * 1.2 or data.value < data.threshold * 0.8
    deviation = round(((data.value - data.threshold) / data.threshold) * 100, 2)
    anomaly_score = min(abs(deviation) / 100, 1.0)
    
    severity = 'LOW'
    if anomaly_score > 0.8:
        severity = 'CRITICAL'
    elif anomaly_score > 0.5:
        severity = 'HIGH'
    elif anomaly_score > 0.2:
        severity = 'MEDIUM'

    return {
        'sensor_id': data.sensor_id,
        'is_anomaly': is_anomaly,
        'anomaly_score': round(anomaly_score, 2),
        'deviation_percentage': deviation,
        'severity': severity,
        'explanation': f'Value deviated by {deviation}% from expected threshold.' if is_anomaly else 'Normal behavior detected.'
    }