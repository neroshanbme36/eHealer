from rest_framework import serializers
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
        extra_kwargs = {'password': {'write_only': True, 'required': True}}