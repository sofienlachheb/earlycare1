from django.urls import path
from health_api.views.prediction import predict
from health_api.views.explore import explore_stats

urlpatterns = [
    path("predict/", predict, name="predict"),
    path("explore/", explore_stats, name="explore"),
]
