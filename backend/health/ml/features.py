def extract_features(profile):
    height_m = profile.height / 100
    bmi = profile.weight / (height_m ** 2)

    return {
        "age": profile.age,
        "bmi": round(bmi, 1),
        "smoking": int(profile.smoking),
        "exercise": profile.exercise,
        "diet_quality": profile.diet_quality,
        "sleep_hours": profile.sleep_hours,
        "stress_level": profile.stress_level,
    }
