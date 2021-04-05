from django.db import models
from django.contrib.auth.models import AbstractUser

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

  def __str__(self):
    return self.username

class Schedule(models.Model):
  day_of_week = models.IntegerField(blank=False)
  day = models.CharField(max_length=50, blank=False)
  opening_time = models.TimeField(blank=False)
  closing_time = models.TimeField(blank=False)
  user_id = models.ForeignKey(User,blank=False, on_delete=models.CASCADE, related_name='schedules')

  def __str__(self):
    return self.day