from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, UserUpdateSerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ObjectDoesNotExist

# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)
    http_method_names = ['get','post','delete']

    def create(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
        
    @action(methods=['post'], detail=False, permission_classes=[])
    def register(self, request):
      # draft_req = self.request.data.copy()
      # draft_req["password"] = make_password('password')
      serializer = self.serializer_class(data=request.data)
      if serializer.is_valid(raise_exception=True):
        try:
          created_user = get_user_model().objects.create_user(**serializer.validated_data)
          serializer = UserSerializer(created_user, many=False)
          return Response(serializer.data, status = status.HTTP_201_CREATED)
        # except ObjectDoesNotExist as e:
        #   return Response({'status_code': '404',' detail': str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception:
          return Response({'status_code': '500', 'detail': 'Something went wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

      return Response({
        'status_code': '400',
        'detail': 'User could not be created with received data'
      }, status = status.HTTP_400_BAD_REQUEST)

class UserUpdateViewSet(viewsets.ModelViewSet):
    queryset = get_user_model().objects.all()
    serializer_class = UserUpdateSerializer
    permission_classes = (IsAuthenticated,)
    http_method_names = ['put']