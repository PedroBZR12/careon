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

logger = logging.getLogger(__name__)

class MedicationsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.medications"

    def ready(self):
        enable = os.environ.get("ENABLE_SCHEDULER", "false").lower()
        if enable != "true":
            logger.info("Scheduler disabled by ENABLE_SCHEDULER=%s", enable)
            return

        try:
            from . import scheduler
            scheduler.start()
            logger.info("Scheduler started")
        except Exception:
            logger.exception("Failed to start scheduler")