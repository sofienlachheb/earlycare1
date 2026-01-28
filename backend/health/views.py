from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Profile
from .serializers import ProfileSerializer
from .logic import calculate_risks, risk_factors


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all().order_by('-created_at')
    serializer_class = ProfileSerializer

    @action(detail=False, methods=['get'])
    def latest(self, request):
        obj = Profile.objects.order_by('-created_at').first()
        if not obj:
            return Response({'detail': 'no profiles'}, status=404)
        return Response(self.get_serializer(obj).data)


class CalculateRisksView(APIView):
    """POST profile fields -> risks + factors (Python port of the old JS logic)."""

    def post(self, request):
        profile = request.data or {}
        risks = calculate_risks(profile)
        factors = risk_factors(profile, risks)
        return Response({'risks': risks, 'factors': factors})
