from rest_framework.decorators import api_view
from rest_framework.response import Response
from health.ml.predictors import predict_cardio_risk

@api_view(["POST"])
def predict(request):
    profile = request.data
    result = predict_cardio_risk(profile)
    return Response(result)
