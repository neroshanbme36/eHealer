from rest_framework import serializers
from .models import Schedule
from django.contrib.auth import get_user_model

class UserSerializer(serializers.ModelSerializer):
  class Meta:
      model = get_user_model()
      fields = (
        'id','username','password','last_login','first_name',
        'last_name','email','is_active','date_joined',
        'birth_date','gender','martial_status','contact_no',
        'qualification','role_type','address_line_1',
        'address_line_2','city','postcode','state',
        'country','updated_on'
      )
      # hashed password should not be displayed in get api method
      # by adding this password will be available only for post and put methods
      extra_kwargs = {
        'username': {'min_length': 4},
        'password': {'write_only': True, 'min_length': 6},
        'first_name': {'required': True}, 'last_name': {'required': True},
        'email': {'required': True}}

class UserUpdateSerializer(serializers.ModelSerializer):
  class Meta:
        model = get_user_model()
        fields = (
          'id','username','first_name',
          'last_name','email','is_active','date_joined',
          'birth_date','gender','martial_status','contact_no',
          'qualification','role_type','address_line_1',
          'address_line_2','city','postcode','state',
          'country','updated_on'
        )
        extra_kwargs = {'password': {'read_only': True}, 'last_login': {'read_only': True}}

class ScheduleSerializer(serializers.ModelSerializer):
  class Meta:
    model = Schedule
    fields = '__all__'