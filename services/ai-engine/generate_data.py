import pandas as pd
import numpy as np
import os

# Create data folder if not exists
os.makedirs('data', exist_ok=True)

# Number of engines (assets) to simulate
n_engines = 20
# Number of cycles per engine before failure
max_cycles = 200

rows = []
for engine_id in range(1, n_engines + 1):
    # Randomize initial sensor values for each engine
    base_temp = np.random.uniform(600, 650)
    base_vib = np.random.uniform(0.01, 0.05)
    base_pressure = np.random.uniform(100, 150)
    
    for cycle in range(1, max_cycles + 1):
        # RUL decreases as cycle increases
        rul = max_cycles - cycle
        
        # Simulate sensor degradation (values increase as failure approaches)
        degradation = (cycle / max_cycles) ** 2
        
        temp = base_temp + (degradation * 50) + np.random.normal(0, 5)
        vib = base_vib + (degradation * 0.1) + np.random.normal(0, 0.005)
        pressure = base_pressure - (degradation * 20) + np.random.normal(0, 2)
        
        rows.append({
            'engine_id': engine_id,
            'cycle': cycle,
            'temperature': round(temp, 2),
            'vibration': round(vib, 4),
            'pressure': round(pressure, 2),
            'RUL': rul
        })

df = pd.DataFrame(rows)
df.to_csv('data/simulated_sensor_data.csv', index=False)
print(f"? Generated {len(df)} rows of simulated sensor data!")
print(f"?? Saved to: data/simulated_sensor_data.csv")
