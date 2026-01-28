from rest_framework import serializers
from .models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            'id', 'user_id', 'name', 'age', 'gender', 'weight', 'height',
            'smoking', 'alcohol', 'exercise', 'diet_quality', 'sleep_hours', 'stress_level',
            'family_diabetes', 'family_heart', 'family_cancer',
            'blood_pressure', 'cholesterol',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
