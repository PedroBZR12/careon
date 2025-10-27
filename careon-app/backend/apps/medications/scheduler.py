from apscheduler.schedulers.background import BackgroundScheduler
from apps.medications.tasks import check_medication_notifications

def start():
    scheduler = BackgroundScheduler()
    # Executa a cada 5 minutos
    scheduler.add_job(check_medication_notifications, 'interval', minutes=5)
    scheduler.start()
