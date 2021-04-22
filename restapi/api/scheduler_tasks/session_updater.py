from apscheduler.schedulers.background import BackgroundScheduler
from api.models import Session

def start():
  print('start job')
  scheduler = BackgroundScheduler()
  scheduler.add_job(predictions, "interval", minutes=1, id="prediction_001", replace_existing=True)
  scheduler.start()

def predictions():
  try:
    print('In to prdictions')
    session = Session.objects.filter(is_start=False).first()
    if session is not None:
      session.is_start = True
      session.save()
  except:
    pass