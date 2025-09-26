from django.db import models

# Create your models here.
class Compromissos(models.Model):
    id = models.BigAutoField(primary_key=True)
    usuario_id = models.BigIntegerField()
    tipo_compromisso = models.TextField()
    data = models.DateField()
    horario = models.TimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'compromissos'
        managed = False
