from django.contrib import admin
from .models import User, Schedule, TherapistFee

# Register your models here.
admin.site.register(User)
admin.site.register(Schedule)
admin.site.register(TherapistFee)