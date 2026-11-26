import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import xgboost as xgb
import joblib
import os

print("?? Loading dataset...")
df = pd.read_csv('data/simulated_sensor_data.csv')

# Features and target
features = ['temperature', 'vibration', 'pressure']
X = df[features]
y = df['RUL']

# Train-test split (80-20)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print(f"Training samples: {len(X_train)}")
print(f"Testing samples: {len(X_test)}")

print("?? Training XGBoost model...")
model = xgb.XGBRegressor(
    n_estimators=100,
    learning_rate=0.1,
    max_depth=5,
    random_state=42
)
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
mae = mean_absolute_error(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2 = r2_score(y_test, y_pred)

print(f"\n?? Model Evaluation:")
print(f"MAE:  {mae:.2f}")
print(f"RMSE: {rmse:.2f}")
print(f"R2:   {r2:.4f}")

# Save model
os.makedirs('models', exist_ok=True)
joblib.dump(model, 'models/rul_model.joblib')
print(f"\n? Model saved to models/rul_model.joblib")

# Save evaluation report
with open('models/rul_model_evaluation.txt', 'w') as f:
    f.write(f"RUL Prediction Model Evaluation\n")
    f.write(f"================================\n")
    f.write(f"Algorithm: XGBoost\n")
    f.write(f"Training Samples: {len(X_train)}\n")
    f.write(f"Testing Samples: {len(X_test)}\n")
    f.write(f"Features: {features}\n\n")
    f.write(f"MAE:  {mae:.2f}\n")
    f.write(f"RMSE: {rmse:.2f}\n")
    f.write(f"R2:   {r2:.4f}\n")
