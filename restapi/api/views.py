from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.hashers import make_password

# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    #permission_classes = (IsAuthenticated,)

    def create(self, request):
      serializer = self.serializer_class(data=request.data)
      if serializer.is_valid(raise_exception=True):
         created_user = get_user_model().objects.create_user(**serializer.validated_data)
         serializer = UserSerializer(created_user, many=False)
         return Response(serializer.data, status = status.HTTP_201_CREATED)
      
      return Response({
        'status_code': '400',
        'detail': 'User could not be created with received data.'
      }, status = status.HTTP_400_BAD_REQUEST)

    
    