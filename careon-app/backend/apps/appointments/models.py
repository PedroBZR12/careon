from django.db import models
from django.contrib.auth.models import User

class Compromisso(models.Model):
    id = models.AutoField(primary_key=True)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name="compromissos", db_column="usuario_id")
    tipo_compromisso = models.CharField(max_length=200)
    descricao = models.TextField(blank=True, null=True)
    data = models.CharField(max_length=20)
    horario = models.TimeField()

    class Meta:
        managed = False
        db_table = "compromissos"
