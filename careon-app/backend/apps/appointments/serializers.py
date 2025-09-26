from rest_framework import serializers
from .models import Compromisso

class CompromissoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Compromisso
        fields = ["id", "tipo_compromisso", "data", "horario"]
        
       
