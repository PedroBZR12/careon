from rest_framework import serializers
from .models import Compromissos

class CompromissosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Compromissos
        fields = '__all__'