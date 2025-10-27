from rest_framework import serializers
from .models import Remedio, Intake

class RemedioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Remedio
        # Campos que a API vai expor
        fields = ["id", "name", "dosage", "time", "day", "frequency", "notes"]

class IntakeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Intake
        fields = ["id", "remedio", "data", "taken", "taken_at"]