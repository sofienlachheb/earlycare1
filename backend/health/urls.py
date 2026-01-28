from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import ProfileViewSet, CalculateRisksView

router = DefaultRouter()
router.register(r'profiles', ProfileViewSet, basename='profiles')


# health/urls.py
from django.urls import path
from health.views.explore import (
    explore_summary,
    explore_risk_distribution,
    explore_trends,
)

urlpatterns = [
    path('', include(router.urls)),
    path('risks/calculate/', CalculateRisksView.as_view(), name='calculate-risks'),
    path("explore/summary/", explore_summary),
    path("explore/risk-distribution/", explore_risk_distribution),
    path("explore/trends/", explore_trends),
]
