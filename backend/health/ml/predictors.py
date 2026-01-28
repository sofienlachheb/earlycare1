import numpy as np
from .models import load_cardio_model
from .features import extract_features

def predict_cardio_risk(profile):
    model = load_cardio_model()
    features = extract_features(profile)
    X = np.array([[features[k] for k in features]])
    proba = model.predict_proba(X)[0]
    return round(proba[1] * 100, 1)
