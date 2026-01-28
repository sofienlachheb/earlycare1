import joblib
from pathlib import Path

BASE = Path(__file__).resolve().parent
_cardio_model = None

def load_cardio_model():
    global _cardio_model
    if _cardio_model is None:
        _cardio_model = joblib.load(BASE / "cardio_model.pkl")
    return _cardio_model
