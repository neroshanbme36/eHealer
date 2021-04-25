from django.contrib import admin
from .models import User, Schedule, TherapistFee, Appointment, PaymentTransaction, Session, Notepad, FavouriteTherapist

# Register your models here.
admin.site.register(User)
admin.site.register(Schedule)
admin.site.register(TherapistFee)
admin.site.register(Appointment)
admin.site.register(PaymentTransaction)
admin.site.register(Session)
admin.site.register(Notepad)
admin.site.register(FavouriteTherapist)