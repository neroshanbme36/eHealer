from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, UserUpdateSerializer, ScheduleSerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ObjectDoesNotExist
from .models import Schedule

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
      draft_req = request.data.copy()
      if 'role_type' in draft_req:
        if draft_req['role_type'].upper() == 'CLIENT':
          draft_req['is_active'] = True
        else:
          draft_req['is_active'] = False
      else:
        return Response({
          'status_code': '400',
          'detail': 'You need to provide a role type'}, 
          status=status.HTTP_400_BAD_REQUEST)
      serializer = self.serializer_class(data=draft_req)
      if serializer.is_valid(raise_exception=True):
        try:
          created_user = get_user_model().objects.create_user(**serializer.validated_data)
          serializer = UserSerializer(created_user, many=False)
          return Response(serializer.data, status = status.HTTP_201_CREATED)
        # except ObjectDoesNotExist as e:
        #   return Response({'status_code': '404',' detail': str(e)}, status=status.HTTP_404_NOT_FOUND)
        # except DoesNotExist:
        except Exception:
          return Response({'status_code': '500', 'detail': 'Something went wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

      return Response({
        'status_code': '400',
        'detail': 'User could not be created with received data'
      }, status = status.HTTP_400_BAD_REQUEST)

    @action(methods=['get'], detail=False)
    def users_by_role(self, request):
      try:
        qu_role_type = request.query_params.get('role_type')
        qu_is_active = request.query_params.get('is_active')
        therapists =  get_user_model().objects.filter(role_type=qu_role_type, is_active=qu_is_active)
        serializer = UserSerializer(therapists, many=True)
        return Response(serializer.data, status = status.HTTP_200_OK)
      except Exception:
          return Response({'status_code': '500', 'detail': 'Something went wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserUpdateViewSet(viewsets.ModelViewSet):
    queryset = get_user_model().objects.all()
    serializer_class = UserUpdateSerializer
    permission_classes = (IsAuthenticated,)
    http_method_names = ['put']

class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    permission_classes = (IsAuthenticated,)

    def create(self, request, *args, **kwargs):
      serializer = self.serializer_class(data=request.data)
      if serializer.is_valid(raise_exception=True):
        try:
          if Schedule.objects.filter(user_id=request.data["user_id"], day_of_week=request.data["day_of_week"], opening_time__range=[request.data["opening_time"],  request.data["closing_time"]], closing_time__range=[request.data["opening_time"],  request.data["closing_time"]]).exists():
            return Response({
              'status_code': '400',
              'detail': 'Schedule already exists'
            }, status = status.HTTP_400_BAD_REQUEST)
          created_schedule = Schedule.objects.create(**serializer.validated_data)
          serializer = ScheduleSerializer(created_schedule, many=False)
          return Response(serializer.data, status = status.HTTP_201_CREATED)
        except Exception:
          return Response({'status_code': '500', 'detail': 'Something went wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
      return Response({
        'status_code': '400',
        'detail': 'Schedule could not be created with received data'
      }, status = status.HTTP_400_BAD_REQUEST)
