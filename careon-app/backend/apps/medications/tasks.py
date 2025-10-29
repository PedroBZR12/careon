# medicamentos/tasks.py
from datetime import datetime, timedelta
from django.utils import timezone
from .models import Remedio
from apps.users.models import DeviceToken  # ou o caminho correto
from django.db import OperationalError
import requests
import json
import logging

logger = logging.getLogger(__name__)

def send_push_notification(token: str, title: str, body: str):
    """
    Envia notificação push via Firebase Cloud Messaging (FCM).
    """
    #chave do servidor obtida no Firebase Console
    FCM_SERVER_KEY = "AIzaSyAd2S5RJzA3ikD7m3w8BxJOrZncVfaer4g"

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"key={FCM_SERVER_KEY}",
    }

    payload = {
        "to": token,
        "notification": {
            "title": title,
            "body": body,
            "sound": "default"
        },
        "priority": "high"
    }

    response = requests.post("https://fcm.googleapis.com/fcm/send", headers=headers, data=json.dumps(payload))
    return response.status_code

def check_medication_notifications():
    """
    Verifica se há remédios cujo horário está próximo e envia notificação.
    """
    now = timezone.localtime()
    weekday = now.strftime("%A").lower()  # ex: 'monday'
    current_time = now.strftime("%H:%M")

    # margem de tempo: 10 minutos antes e depois
    margin = timedelta(minutes=10)

    # percorre todos os remédios cadastrados
    try:
        logger.info(f"[Scheduler] Verificando notificações às {now.strftime('%H:%M:%S')}")
        for remedio in Remedio.objects.all():
            logger.debug(f"[Remédio] Verificando: {remedio.name} para {remedio.usuario.username}")
            if remedio.day.lower() == weekday:
                try:
                    med_time = remedio.time
                except ValueError:
                    continue  # ignora se o formato for inválido

                med_datetime = datetime.combine(now.date(), med_time)
                med_datetime = timezone.make_aware(med_datetime)
                logger.debug(f"[Tempo] Agora: {now}, Remédio: {med_datetime}, Diferença: {abs(now - med_datetime)}")

                # verifica se estamos dentro da janela de notificação
                if abs((now - med_datetime)) <= margin:
                    logger.info(f"[Notificação] Dentro da janela para {remedio.name} ({remedio.time})")
                    logger.info(f"[Notificação] Enviando para {user.username} - Token: {token}")
                    # envia notificação
                    user = remedio.usuario
                    if hasattr(user, "device_token"):
                        token = user.device_token.token
                        title = "Hora de tomar seu remédio 💊"
                        body = f"{remedio.name} ({remedio.dosage}) - {remedio.notes or ''}"
                        status = send_push_notification(token, title, body)
                        print(f"Notificação enviada para {user.username} (status {status})")
    except OperationalError:
        print("Erro de conexão com o banco. Job ignorado.")
        return
