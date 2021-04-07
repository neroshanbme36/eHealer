from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from .serializers import AppoitmentUserSerializer, PaymentSerializer, SessionSerializer, UserSerializer, UserUpdateSerializer, ScheduleSerializer, TherapistFeeSerializer, AppointmentSerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ObjectDoesNotExist
from .models import Session, Schedule, TherapistFee, Appointment, Payment
from django.db.models import Q

# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    # permission_classes = (IsAuthenticated,)
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

    @action(methods=['get'], detail=False)
    def schedules_by_user_id(self, request):
      try:
        qu_user_id = request.query_params.get('user_id')
        schedules = Schedule.objects.filter(user=qu_user_id)
        serializer = ScheduleSerializer(schedules, many=True)
        return Response(serializer.data, status = status.HTTP_200_OK)
      except Exception:
          return Response({'status_code': '500', 'detail': 'Something went wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TherapistFeeViewSet(viewsets.ModelViewSet):
  queryset = TherapistFee.objects.all()
  serializer_class = TherapistFeeSerializer
  permission_classes = (IsAuthenticated,)
  http_method_names = ['get','post', 'put']

class AppointmentViewSet(viewsets.ModelViewSet):
  queryset = Appointment.objects.all()
  serializer_class = AppointmentSerializer
  permission_classes = (IsAuthenticated,)
  http_method_names = ['get','post', 'put']

  @action(methods=['get'], detail=False)
  def appointments_by_client(self, request):
    try:
      qu_user_id = request.query_params.get('user_id')
      appointments = Appointment.objects.filter(client=qu_user_id)
      serializer = AppoitmentUserSerializer(appointments, many=True)
      return Response(serializer.data, status = status.HTTP_200_OK)
    except Exception:
        return Response({'status_code': '500', 'detail': 'Something went wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

  @action(methods=['get'], detail=False)
  def appointments_to_therapist(self, request):
    try:
      qu_user_id = request.query_params.get('user_id')
      appointments = Appointment.objects.filter(therapist=qu_user_id)
      serializer = AppoitmentUserSerializer(appointments, many=True)
      return Response(serializer.data, status = status.HTTP_200_OK)
    except Exception:
        return Response({'status_code': '500', 'detail': 'Something went wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PaymentViewSet(viewsets.ModelViewSet):
  queryset = Payment.objects.all()
  serializer_class = PaymentSerializer
  permission_classes = (IsAuthenticated,)
  http_method_names = ['get','post', 'put']

class SessionViewSet(viewsets.ModelViewSet):
  queryset = Session.objects.all()
  serializer_class = SessionSerializer
  permission_classes = (IsAuthenticated,)
  http_method_names = ['get','post', 'put']
