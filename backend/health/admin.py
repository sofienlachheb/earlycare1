from django.contrib import admin
from .models import Profile


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'age', 'gender', 'created_at', 'updated_at')
    list_filter = ('gender', 'smoking', 'family_diabetes', 'family_heart', 'family_cancer')
    search_fields = ('name', 'user_id')
