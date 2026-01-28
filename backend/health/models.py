# health/models.py
from django.db import models

class HealthProfile(models.Model):
    GENDER_CHOICES = [
        ("male", "Male"),
        ("female", "Female"),
        ("other", "Other"),
    ]

    created_at = models.DateTimeField(auto_now_add=True)

    name = models.CharField(max_length=120, blank=True)
    age = models.PositiveIntegerField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)

    weight = models.FloatField()
    height = models.FloatField()

    smoking = models.BooleanField(default=False)
    exercise = models.FloatField(help_text="Hours per week")
    diet_quality = models.IntegerField()
    sleep_hours = models.FloatField()
    stress_level = models.IntegerField()

    # (اختياري – لاحقًا من ML)
    cardio_risk = models.FloatField(null=True, blank=True)
    diabetes_risk = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"Profile {self.id} ({self.age}y)"
