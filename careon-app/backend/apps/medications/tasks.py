# medicamentos/tasks.py
from datetime import datetime, timedelta
from django.utils import timezone
from .models import Remedio
from users.models import DeviceToken  # ou o caminho correto
import requests
import json

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
    for remedio in Remedio.objects.all():
        if remedio.day.lower() == weekday:
            try:
                med_time = datetime.strptime(remedio.time, "%H:%M").time()
            except ValueError:
                continue  # ignora se o formato for inválido

            med_datetime = datetime.combine(now.date(), med_time)
            med_datetime = timezone.make_aware(med_datetime)

            # verifica se estamos dentro da janela de notificação
            if abs((now - med_datetime)) <= margin:
                # envia notificação
                user = remedio.usuario
                if hasattr(user, "device_token"):
                    token = user.device_token.token
                    title = "Hora de tomar seu remédio 💊"
                    body = f"{remedio.name} ({remedio.dosage}) - {remedio.notes or ''}"
                    status = send_push_notification(token, title, body)
                    print(f"Notificação enviada para {user.username} (status {status})")
