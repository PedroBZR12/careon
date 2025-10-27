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


class Intake(models.Model):
    usuario = models.ForeignKey(User,
        on_delete=models.CASCADE,
        db_column="usuario"
    )
    remedio = models.ForeignKey(
        Remedio,
        on_delete=models.CASCADE,
        db_column="medicamento"
    )
    data = models.DateField(db_column="data")
    taken = models.BooleanField(db_column="status", default=False)
    taken_at = models.DateTimeField(db_column="horario", null=True, blank=True)

    class Meta:
        unique_together = ("usuario", "remedio", "data")  
        db_table = "remedios_tomados"  
        managed = False 