from django.db import models
from django.contrib.auth.models import User

class Remedio(models.Model):
    usuario = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        db_column="usuarios_id",
        related_name="remedios"
        )
    name = models.CharField(max_length=100, db_column="nome_remedio")
    dosage = models.CharField(max_length=50, db_column="dosagem")
    time = models.CharField(max_length=10, db_column="horario")
    day = models.CharField(max_length=20, db_column="dia_Semana")
    frequency = models.CharField(max_length=50, db_column="quantidade")
    notes = models.TextField(null=True, blank=True, db_column="observacoes")

    class Meta:
        db_table = 'remedios'
        managed = False

    def __str__(self):
        return self.name
