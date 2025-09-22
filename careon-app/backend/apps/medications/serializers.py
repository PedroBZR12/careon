from rest_framework import serializers
from .models import Remedio

class RemedioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Remedio
        # Campos que a API vai expor
        fields = ["id", "name", "dosage", "time", "day", "frequency", "notes"]
