from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from .serializers import SessionReportSerializer, PaymentTransactionSerializer, AppoitmentUserSerializer, SessionSerializer, UserSerializer, UserUpdateSerializer, ScheduleSerializer, TherapistFeeSerializer, AppointmentSerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ObjectDoesNotExist
from .models import Session, Schedule, TherapistFee, Appointment, PaymentTransaction
from django.db.models import Q
from datetime import datetime, timedelta
from django.utils.dateparse import parse_date

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

    @action(methods=['get'], detail=False)
    def user_by_username(self, request):
      try:
        qu_username = request.query_params.get('username')
        user = get_user_model().objects.get(username=qu_username)
        serializer = UserSerializer(user, many=False)
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

    @action(methods=['get'], detail=False)
    def unbooked_slots(self, request):
      try:
        qu_requested_date = request.query_params.get('requested_date')
        qu_user_id = request.query_params.get('user_id')
        req_day_name = parse_date(qu_requested_date).strftime("%A")
        start_date = parse_date(qu_requested_date)
        end_date = parse_date(qu_requested_date) + timedelta(days=1)
        schedules = Schedule.objects.filter(user=qu_user_id, day=req_day_name)
        appointments = Appointment.objects.filter(therapist=qu_user_id, slot_date__gte=start_date, slot_date__lte=end_date, status_type__lte=1)
        unbooked_sch = []
        if schedules.exists():
          for s in schedules:
            open_tim = datetime.combine(start_date, s.opening_time)
            clos_tim = datetime.combine(start_date, s.closing_time)
            if appointments.filter(slot_start_time__gte=open_tim, slot_start_time__lte=clos_tim).exists() == False:
              unbooked_sch.append(s)
        serializer = ScheduleSerializer(unbooked_sch, many=True)
        return Response(serializer.data, status = status.HTTP_200_OK)
      except Exception:
          return Response({'status_code': '500', 'detail': 'Something went wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TherapistFeeViewSet(viewsets.ModelViewSet):
  queryset = TherapistFee.objects.all()
  serializer_class = TherapistFeeSerializer
  permission_classes = (IsAuthenticated,)
  http_method_names = ['get','post', 'put']

  @action(methods=['get'], detail=False)
  def therapist_fee_by_user(self, request):
    try:
      qu_user_id = request.query_params.get('user_id')
      therapist_fee = TherapistFee.objects.get(user=qu_user_id)
      serializer = TherapistFeeSerializer(therapist_fee, many=False)
      return Response(serializer.data, status = status.HTTP_200_OK)
    except Exception:
        return Response({'status_code': '500', 'detail': 'Something went wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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

  @action(methods=['get'], detail=False)
  def is_appointment_exist(self, request):
    try:
      qu_requested_date = request.query_params.get('requested_date')
      qu_schedule_id = request.query_params.get('schedule_id')
      schedule = Schedule.objects.get(id=qu_schedule_id)
      req_date = parse_date(qu_requested_date)
      open_tim = datetime.combine(req_date, schedule.opening_time)
      clos_tim = datetime.combine(req_date, schedule.closing_time)
      is_appointment_exist = Appointment.objects.filter(therapist=schedule.user, slot_date=qu_requested_date, slot_start_time__gte=open_tim, slot_end_time__lte=clos_tim).exists()
      return Response({'result': is_appointment_exist}, status = status.HTTP_200_OK)
    except Exception:
        return Response({'status_code': '500', 'detail': 'Something went wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PaymentTransactionViewSet(viewsets.ModelViewSet):
  queryset = PaymentTransaction.objects.all()
  serializer_class = PaymentTransactionSerializer
  permission_classes = (IsAuthenticated,)
  http_method_names =  ['get','post', 'put']

  @action(methods=['get'], detail=False)
  def payment_by_appointmentId(self, request):
    try:
      qu_appointment_id = request.query_params.get('appointment_id')
      payment = PaymentTransaction.objects.get(appointment=qu_appointment_id)
      serializer = PaymentTransactionSerializer(payment, many=False)
      return Response(serializer.data, status = status.HTTP_200_OK)
    except Exception:
        return Response({'status_code': '500', 'detail': 'Something went wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SessionViewSet(viewsets.ModelViewSet):
  queryset = Session.objects.all()
  serializer_class = SessionSerializer
  permission_classes = (IsAuthenticated,)
  http_method_names = ['get','post', 'put']

  def post(self, request, *args, **kwargs):
    serializer = SessionSerializer(data=request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

  @action(methods=['get'], detail=False)
  def session_by_appointment(self, request):
    try:
      qu_appointment_id = request.query_params.get('appointment_id')
      session = Session.objects.get(appointment=qu_appointment_id)
      serializer = SessionSerializer(session, many=False)
      return Response(serializer.data, status = status.HTTP_200_OK)
    except Exception:
        return Response({'status_code': '404', 'detail': 'Session not found'}, status=status.HTTP_404_NOT_FOUND)

  @action(methods=['get'], detail=False)
  def report_by_client(self, request):
    try:
      qu_client_id = request.query_params.get('client_id')
      sessions = Session.objects.filter(client=qu_client_id,is_end=True)
      serializer = SessionReportSerializer(sessions, many=True)
      return Response(serializer.data, status = status.HTTP_200_OK)
    except Exception:
        return Response({'status_code': '500', 'detail': 'Something went wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

  @action(methods=['get'], detail=False)
  def report_by_therapist(self, request):
    try:
      qu_therapist_id = request.query_params.get('therapist_id')
      sessions = Session.objects.filter(therapist=qu_therapist_id,is_end=True)
      serializer = SessionReportSerializer(sessions, many=True)
      return Response(serializer.data, status = status.HTTP_200_OK)
    except Exception:
        return Response({'status_code': '500', 'detail': 'Something went wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)