# health/views/explore.py
from django.db.models import Avg
from django.db.models.functions import TruncMonth
from rest_framework.decorators import api_view
from rest_framework.response import Response
from health.models import HealthProfile


@api_view(["GET"])
def explore_summary(request):
    qs = HealthProfile.objects.all()

    age_min = request.GET.get("age_min")
    age_max = request.GET.get("age_max")
    gender = request.GET.get("gender")

    if age_min:
        qs = qs.filter(age__gte=int(age_min))
    if age_max:
        qs = qs.filter(age__lte=int(age_max))
    if gender and gender != "all":
        qs = qs.filter(gender=gender)

    total = qs.count() or 1

    return Response({
        "users": total,
        "avg_age": round(qs.aggregate(Avg("age"))["age__avg"] or 0, 1),
        "smokers_pct": round(qs.filter(smoking=True).count() * 100 / total, 1),
        "avg_exercise": round(qs.aggregate(Avg("exercise"))["exercise__avg"] or 0, 1),
    })


@api_view(["GET"])
def explore_risk_distribution(request):
    qs = HealthProfile.objects.exclude(cardio_risk__isnull=True)
    total = qs.count() or 1

    low = qs.filter(cardio_risk__lt=30).count()
    medium = qs.filter(cardio_risk__gte=30, cardio_risk__lt=60).count()
    high = qs.filter(cardio_risk__gte=60).count()

    return Response({
        "low": round(low * 100 / total, 1),
        "medium": round(medium * 100 / total, 1),
        "high": round(high * 100 / total, 1),
    })


@api_view(["GET"])
def explore_trends(request):
    qs = (
        HealthProfile.objects
        .exclude(cardio_risk__isnull=True)
        .annotate(month=TruncMonth("created_at"))
        .values("month")
        .annotate(
            cardio=Avg("cardio_risk"),
            diabetes=Avg("diabetes_risk"),
        )
        .order_by("month")
    )

    return Response([
        {
            "month": x["month"].strftime("%Y-%m"),
            "cardio": round(x["cardio"] or 0, 1),
            "diabetes": round(x["diabetes"] or 0, 1),
        }
        for x in qs
    ])
