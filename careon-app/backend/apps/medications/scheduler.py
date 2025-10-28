from apscheduler.schedulers.background import BackgroundScheduler
from apps.medications.tasks import check_medication_notifications

def start():
    scheduler = BackgroundScheduler()
    scheduler.add_job(check_medication_notifications,
        trigger='interval',
        minutes=5,
        max_instances=1,
        coalesce=True,
        id='check_medication_notifications'
    )
    scheduler.start()
