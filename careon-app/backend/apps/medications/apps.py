"""
from django.apps import AppConfig


class MedicationsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.medications' #caminho

    def ready(self):
        from . import scheduler
        scheduler.start()
        
        
        """
        
        
import os
import logging
from django.apps import AppConfig
from apscheduler.schedulers.background import BackgroundScheduler

logger = logging.getLogger(__name__)

class MedicationsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.medications"

    def ready(self):
        if os.environ.get("ENABLE_SCHEDULER") == "true":
            from .tasks import check_medication_notifications
            scheduler = BackgroundScheduler()
            scheduler.add_job(check_medication_notifications, 'interval', minutes=5)
            scheduler.start()
            import logging
            logger = logging.getLogger(__name__)
            logger.info("✅ Scheduler ativado com ENABLE_SCHEDULER=true")
        else:
            import logging
            logger = logging.getLogger(__name__)
            logger.info("⏸️ Scheduler desativado por ENABLE_SCHEDULER=false")