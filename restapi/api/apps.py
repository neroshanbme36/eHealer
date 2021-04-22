from django.apps import AppConfig


class ApiConfig(AppConfig):
    name = 'api'

    def ready(self):
        print('Starting scheduler...')
        from .scheduler_tasks import session_updater
        session_updater.start()