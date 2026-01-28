"""نفس منطق حساب المخاطر الموجود في كود الـHTML القديم لكن بصيغة Python."""

from dataclasses import dataclass
from typing import Dict, List, Any


@dataclass
class Risks:
    cardio: int
    diabetes: int
    oxidative: int
    bmi: float


def _clamp(v: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, v))


def calculate_risks(profile: Dict[str, Any]) -> Risks:
    cardio = 10
    diabetes = 8
    oxidative = 12

    age = int(profile.get('age', 35) or 35)
    weight = float(profile.get('weight', 70) or 70)
    height = float(profile.get('height', 170) or 170)

    if age > 50:
        cardio += 15
        diabetes += 10
        oxidative += 8
    elif age > 40:
        cardio += 8
        diabetes += 5
        oxidative += 4

    height_m = height / 100.0
    bmi = weight / (height_m * height_m) if height_m > 0 else 0

    if bmi > 30:
        cardio += 20
        diabetes += 25
        oxidative += 15
    elif bmi > 25:
        cardio += 10
        diabetes += 15
        oxidative += 8

    if bool(profile.get('smoking', False)):
        cardio += 25
        oxidative += 30

    alcohol = profile.get('alcohol', 'none')
    if alcohol == 'heavy':
        cardio += 15
        oxidative += 20
    elif alcohol == 'regular':
        cardio += 8
        oxidative += 10

    exercise = float(profile.get('exercise', 3) or 3)
    cardio -= min(exercise * 2, 15)
    diabetes -= min(exercise * 2, 12)
    oxidative -= min(exercise * 1.5, 10)

    diet_quality = int(profile.get('diet_quality', 5) or 5)
    diabetes -= min((diet_quality - 5) * 3, 15)
    cardio -= min((diet_quality - 5) * 2, 10)

    sleep_hours = float(profile.get('sleep_hours', 7) or 7)
    if sleep_hours < 6 or sleep_hours > 9:
        cardio += 8
        diabetes += 6
        oxidative += 10

    stress_level = int(profile.get('stress_level', 5) or 5)
    cardio += max((stress_level - 5) * 2, 0)
    oxidative += max((stress_level - 5) * 3, 0)

    if bool(profile.get('family_heart', False)):
        cardio += 15
    if bool(profile.get('family_diabetes', False)):
        diabetes += 20
    if bool(profile.get('family_cancer', False)):
        oxidative += 10

    bp = profile.get('blood_pressure', 'normal')
    if bp == 'high_2':
        cardio += 20
    elif bp == 'high_1':
        cardio += 12
    elif bp == 'elevated':
        cardio += 5

    chol = profile.get('cholesterol', 'normal')
    if chol == 'high':
        cardio += 15
    elif chol == 'borderline':
        cardio += 8

    return Risks(
        cardio=int(round(_clamp(cardio, 5, 95))),
        diabetes=int(round(_clamp(diabetes, 5, 95))),
        oxidative=int(round(_clamp(oxidative, 5, 95))),
        bmi=round(bmi, 1),
    )


def get_risk_factors(profile: Dict[str, Any], risks: Risks) -> List[Dict[str, Any]]:
    factors: List[Dict[str, Any]] = []

    height = float(profile.get('height', 170) or 170)
    weight = float(profile.get('weight', 70) or 70)
    height_m = height / 100.0
    bmi = weight / (height_m * height_m) if height_m > 0 else 0

    if bool(profile.get('smoking', False)):
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

    exercise = float(profile.get('exercise', 3) or 3)
    if exercise < 3:
        factors.append({
            'name': 'قلة الحركة',
            'impact': 'متوسط',
            'color': 'amber',
            'description': 'أقل من 3 ساعات نشاط بدني أسبوعياً يزيد مخاطرك.'
        })

    stress = int(profile.get('stress_level', 5) or 5)
    if stress >= 7:
        factors.append({
            'name': 'التوتر المزمن',
            'impact': 'متوسط',
            'color': 'amber',
            'description': 'مستوى التوتر المرتفع يؤثر على جهازك القلبي الوعائي.'
        })

    diet = int(profile.get('diet_quality', 5) or 5)
    if diet < 5:
        factors.append({
            'name': 'التغذية',
            'impact': 'متوسط',
            'color': 'orange',
            'description': 'التغذية غير المتوازنة تزيد مخاطر السكري.'
        })

    if bool(profile.get('family_heart', False)) or bool(profile.get('family_diabetes', False)):
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
