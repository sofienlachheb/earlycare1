from django.db.models import Avg
from health.models import HealthProfile

def aggregate_cardio_distribution():
    qs = HealthProfile.objects.exclude(cardio_risk__isnull=True)
    total = qs.count() or 1
    return {
        "low": qs.filter(cardio_risk__lt=30).count() * 100 / total,
        "medium": qs.filter(cardio_risk__gte=30, cardio_risk__lt=60).count() * 100 / total,
        "high": qs.filter(cardio_risk__gte=60).count() * 100 / total,
    }
