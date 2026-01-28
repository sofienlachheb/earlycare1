from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, Any, List


def _clamp(v: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, v))


def calculate_risks(profile: Dict[str, Any]) -> Dict[str, Any]:
    """A simple, educational 'mock ML' risk calculator (ported from the old JS)."""
    age = int(profile.get('age') or 35)
    weight = float(profile.get('weight') or 70)
    height = float(profile.get('height') or 170)
    smoking = bool(profile.get('smoking') or False)
    alcohol = profile.get('alcohol') or 'none'
    exercise = float(profile.get('exercise') or 3)
    diet_quality = int(profile.get('diet_quality') or 5)
    sleep_hours = float(profile.get('sleep_hours') or 7)
    stress_level = int(profile.get('stress_level') or 5)
    family_heart = bool(profile.get('family_heart') or False)
    family_diabetes = bool(profile.get('family_diabetes') or False)
    family_cancer = bool(profile.get('family_cancer') or False)
    blood_pressure = profile.get('blood_pressure') or 'normal'
    cholesterol = profile.get('cholesterol') or 'normal'

    cardio_risk = 10.0
    diabetes_risk = 8.0
    oxidative_risk = 12.0

    if age > 50:
        cardio_risk += 15
        diabetes_risk += 10
        oxidative_risk += 8
    elif age > 40:
        cardio_risk += 8
        diabetes_risk += 5
        oxidative_risk += 4

    height_m = height / 100.0
    bmi = weight / (height_m * height_m) if height_m > 0 else 24.0

    if bmi > 30:
        cardio_risk += 20
        diabetes_risk += 25
        oxidative_risk += 15
    elif bmi > 25:
        cardio_risk += 10
        diabetes_risk += 15
        oxidative_risk += 8

    if smoking:
        cardio_risk += 25
        oxidative_risk += 30

    if alcohol == 'heavy':
        cardio_risk += 15
        oxidative_risk += 20
    elif alcohol == 'regular':
        cardio_risk += 8
        oxidative_risk += 10

    cardio_risk -= min(exercise * 2, 15)
    diabetes_risk -= min(exercise * 2, 12)
    oxidative_risk -= min(exercise * 1.5, 10)

    diabetes_risk -= min((diet_quality - 5) * 3, 15)
    cardio_risk -= min((diet_quality - 5) * 2, 10)

    if sleep_hours < 6 or sleep_hours > 9:
        cardio_risk += 8
        diabetes_risk += 6
        oxidative_risk += 10

    cardio_risk += max((stress_level - 5) * 2, 0)
    oxidative_risk += max((stress_level - 5) * 3, 0)

    if family_heart:
        cardio_risk += 15
    if family_diabetes:
        diabetes_risk += 20
    if family_cancer:
        oxidative_risk += 10

    if blood_pressure == 'high_2':
        cardio_risk += 20
    elif blood_pressure == 'high_1':
        cardio_risk += 12
    elif blood_pressure == 'elevated':
        cardio_risk += 5

    if cholesterol == 'high':
        cardio_risk += 15
    elif cholesterol == 'borderline':
        cardio_risk += 8

    return {
        'cardio': int(_clamp(round(cardio_risk), 5, 95)),
        'diabetes': int(_clamp(round(diabetes_risk), 5, 95)),
        'oxidative': int(_clamp(round(oxidative_risk), 5, 95)),
        'bmi': round(bmi, 1),
    }


def risk_factors(profile: Dict[str, Any], risks: Dict[str, Any]) -> List[Dict[str, str]]:
    factors: List[Dict[str, str]] = []

    height = float(profile.get('height') or 170)
    weight = float(profile.get('weight') or 70)
    height_m = height / 100.0
    bmi = weight / (height_m * height_m) if height_m > 0 else 24.0

    if bool(profile.get('smoking') or False):
        factors.append({
            'name': 'التدخين',
            'impact': 'مرتفع',
            'color': 'red',
            'description': 'التدخين هو أهم عامل خطر قلبي وعائي قابل للتعديل.'
        })

    if bmi > 25:
        factors.append({
            'name': 'زيادة الوزن/السمنة',
            'impact': 'مرتفع' if bmi > 30 else 'متوسط',
            'color': 'red' if bmi > 30 else 'amber',
            'description': f'مؤشر كتلة جسمك {bmi:.1f} يزيد مخاطر السكري وأمراض القلب.'
        })

    if float(profile.get('exercise') or 0) < 3:
        factors.append({
            'name': 'قلة الحركة',
            'impact': 'متوسط',
            'color': 'amber',
            'description': 'أقل من 3 ساعات نشاط بدني أسبوعياً يزيد مخاطرك.'
        })

    if int(profile.get('stress_level') or 0) >= 7:
        factors.append({
            'name': 'التوتر المزمن',
            'impact': 'متوسط',
            'color': 'amber',
            'description': 'مستوى التوتر المرتفع يؤثر على جهازك القلبي الوعائي.'
        })

    if int(profile.get('diet_quality') or 5) < 5:
        factors.append({
            'name': 'التغذية',
            'impact': 'متوسط',
            'color': 'orange',
            'description': 'التغذية غير المتوازنة تزيد مخاطر السكري.'
        })

    if bool(profile.get('family_heart') or False) or bool(profile.get('family_diabetes') or False):
        factors.append({
            'name': 'التاريخ العائلي',
            'impact': 'غير قابل للتعديل',
            'color': 'purple',
            'description': 'خلفيتك الوراثية تزيد من أهمية اليقظة.'
        })

    if not factors:
        factors.append({
            'name': 'ملف إيجابي',
            'impact': 'جيد',
            'color': 'green',
            'description': 'عاداتك الحياتية الحالية إيجابية بشكل عام. استمر هكذا!'
        })

    return factors
