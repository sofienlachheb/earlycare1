from rest_framework import serializers

class ProfileSerializer(serializers.Serializer):
    age = serializers.IntegerField()
    gender = serializers.CharField()
    weight = serializers.FloatField()
    height = serializers.FloatField()
    smoking = serializers.BooleanField()
