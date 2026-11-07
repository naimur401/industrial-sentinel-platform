from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random

app = FastAPI(title='Industrial Sentinel AI Service')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AssetData(BaseModel):
    asset_id: str
    asset_type: str
    criticality: str

class SensorData(BaseModel):
    sensor_id: str
    value: float
    threshold: float

@app.get('/')
def read_root():
    return {'status': 'AI Service is running'}

@app.get('/health')
def health_check():
    return {'status': 'healthy', 'models_loaded': 0}

@app.post('/predict/rul')
def predict_rul(data: AssetData):
    rul_days = random.randint(10, 365)
    failure_prob = round(random.uniform(0.01, 0.95), 2)
    return {
        'asset_id': data.asset_id,
        'remaining_useful_life_days': rul_days,
        'failure_probability': failure_prob,
        'confidence': 0.85,
        'recommendation': 'Schedule maintenance soon' if failure_prob > 0.6 else 'Asset is healthy'
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