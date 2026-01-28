from rest_framework.decorators import api_view
from rest_framework.response import Response
from health.ml.aggregators import aggregate_cardio_distribution

@api_view(["GET"])
def explore_stats(request):
    return Response(aggregate_cardio_distribution())
