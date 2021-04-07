from django.contrib import admin
from .models import User, Schedule, TherapistFee, Appointment, Payment, Session

# Register your models here.
admin.site.register(User)
admin.site.register(Schedule)
admin.site.register(TherapistFee)
admin.site.register(Appointment)
admin.site.register(Payment)
admin.site.register(Session)