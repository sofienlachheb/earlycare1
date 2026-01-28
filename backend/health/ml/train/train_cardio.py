import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

df = pd.read_csv("datasets/data.csv")

FEATURES = [
    "age", "bmi", "smoking", "exercise",
    "diet_quality", "sleep_hours", "stress_level"
]

X = df[FEATURES]
y = df["cardio_risk_label"]

model = RandomForestClassifier(n_estimators=200, random_state=42)
model.fit(X, y)

joblib.dump(model, "../cardio_model.pkl")
