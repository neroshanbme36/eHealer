from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxValueValidator, MinValueValidator

# Create your models here.
# extending the user model of django framework user model
class User(AbstractUser):
  birth_date = models.DateField(blank=False)
  gender = models.CharField(max_length=20, blank=False)
  martial_status = models.CharField(max_length=20, blank=False)
  contact_no = models.CharField(max_length=10, blank=False)
  qualification = models.CharField(max_length=50, blank=True, null=True, default=None)
  role_type = models.CharField(max_length=50, blank=False)
  address_line_1 = models.CharField(max_length=100, blank=False)
  address_line_2 = models.CharField(max_length=50, blank=True, null=True, default=None)
  city = models.CharField(max_length=50, blank=False)
  postcode = models.CharField(max_length=50, blank=False)
  state = models.CharField(max_length=50, blank=False)
  country = models.CharField(max_length=50, blank=False)
  updated_on = models.DateTimeField(auto_now=True)
  specialization = models.TextField(max_length=250, blank=True, default='')
  experience = models.DecimalField(blank=True,max_digits=5, decimal_places=2,validators=[MinValueValidator(0), MaxValueValidator(200)], default=0)

class Schedule(models.Model):
  day_of_week = models.IntegerField(blank=False, validators=[MinValueValidator(1),MaxValueValidator(7)])
  day = models.CharField(max_length=50, blank=False)
  opening_time = models.TimeField(blank=False)
  closing_time = models.TimeField(blank=False)
  user = models.ForeignKey(User,blank=False, on_delete=models.CASCADE, related_name='schedules')

class TherapistFee(models.Model):
  fee = models.DecimalField(blank=False,max_digits=22, decimal_places=4,validators=[MinValueValidator(0)])
  user = models.OneToOneField(User,blank=False, on_delete=models.CASCADE, related_name='therapist_fees')
  slot_duration_in_mins = models.IntegerField(blank=False, validators=[MinValueValidator(1)], default=1)

class Appointment(models.Model):
  slot_date = models.DateTimeField(blank=False)
  slot_start_time = models.DateTimeField(blank=False)
  slot_end_time = models.DateTimeField(blank=False)
  slot_duration_in_mins = models.IntegerField(blank=False, validators=[MinValueValidator(1)], default=1)
  fee = models.DecimalField(blank=False,max_digits=22, decimal_places=4,validators=[MinValueValidator(0)])
  client_note = models.TextField(max_length=500, blank=True, null=True)
  # 0 - waiting, 1 - Accepted, 2 - Cancelled By Therapist, 3 - Cancelled by Client
  status_type = models.IntegerField(blank=False, validators=[MinValueValidator(0),MaxValueValidator(3)])
  cancellation_reason = models.TextField(max_length=500, blank=True, null=True)
  created_on = models.DateTimeField(auto_now_add=True)
  updated_on = models.DateTimeField(auto_now=True)
  client = models.ForeignKey(User,blank=False, on_delete=models.DO_NOTHING, related_name='client_appointments')
  therapist = models.ForeignKey(User, blank=False, on_delete=models.DO_NOTHING, related_name='therapist_appointments')

class PaymentTransaction(models.Model):
  # 0 - sale, 1 - refund
  trans_type = models.IntegerField(blank=False, validators=[MinValueValidator(0),MaxValueValidator(1)])
  fee = models.DecimalField(blank=False,max_digits=22, decimal_places=4,validators=[MinValueValidator(0)])
  created_on = models.DateTimeField(auto_now_add=True)
  updated_on = models.DateTimeField(auto_now=True)
  appointment = models.OneToOneField(Appointment, blank=False, on_delete=models.DO_NOTHING, related_name='payments')
  client = models.ForeignKey(User,blank=False, on_delete=models.DO_NOTHING, related_name='client_payments')
  therapist = models.ForeignKey(User, blank=False, on_delete=models.DO_NOTHING, related_name='therapist_payments')

class Session(models.Model):
  summary = models.TextField(max_length=3000, blank=True, null = True)
  appointment = models.OneToOneField(Appointment, blank=False, on_delete=models.DO_NOTHING, related_name='sessions')
  client = models.ForeignKey(User,blank=False, on_delete=models.DO_NOTHING, related_name='client_sessions')
  therapist = models.ForeignKey(User, blank=False, on_delete=models.DO_NOTHING, related_name='therapist_sessions')

