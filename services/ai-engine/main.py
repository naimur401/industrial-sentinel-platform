from fastapi import FastAPI
from pydantic import BaseModel
import random

app = FastAPI(title='Industrial Sentinel AI Service')

class AssetData(BaseModel):
    asset_id: str
    asset_type: str
    criticality: str

@app.get('/')
def read_root():
    return {'status': 'AI Service is running'}

@app.get('/health')
def health_check():
    return {'status': 'healthy', 'models_loaded': 0}

@app.post('/predict/rul')
def predict_rul(data: AssetData):
    # Placeholder logic for now (we will replace with ML model later)
    rul_days = random.randint(10, 365)
    failure_prob = round(random.uniform(0.01, 0.95), 2)
    return {
        'asset_id': data.asset_id,
        'remaining_useful_life_days': rul_days,
        'failure_probability': failure_prob,
        'confidence': 0.85,
        'recommendation': 'Schedule maintenance soon' if failure_prob > 0.6 else 'Asset is healthy'
    }
