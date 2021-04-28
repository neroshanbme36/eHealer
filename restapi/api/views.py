from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from .serializers import CustomerContactEnquirySerializer, FavouriteTherapistSerializer, FavouriteTherapistDtoSerializer, NotepadSerializer, SessionReportSerializer, PaymentTransactionSerializer, AppoitmentUserSerializer, SessionSerializer, UserSerializer, UserUpdateSerializer, ScheduleSerializer, TherapistFeeSerializer, AppointmentSerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ObjectDoesNotExist
from .models import CustomerContactEnquiry, Session, Schedule, TherapistFee, Appointment, PaymentTransaction, Notepad, FavouriteTherapist
from django.db.models import Q
from datetime import datetime, timedelta
from django.utils.dateparse import parse_date
from django.http import HttpResponse
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator
from django.template import loader
import sendgrid
from sendgrid.helpers.mail import Mail,Email,Content
from django.shortcuts import render
from django.views.generic import *
from django.core.mail import EmailMessage


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

    @action(methods=['get'], detail=False)
    def send_password_link(self, request):
      qu_username = request.query_params.get('username')
      if len(qu_username) > 0:
          try:
            user = get_user_model().objects.get(username=qu_username)
            subject_dto = {
                'protocol': 'https',
                'site_name': 'eHealer',
                'domain': request.META['HTTP_HOST'],
                'user': user,
                'email': user.email,
                'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                'token': default_token_generator.make_token(user),
            }
            subject_temp_path = 'registration/password_reset_subject.txt'
            email_temp_path = 'registration/password_reset_email.html'
            subject = loader.render_to_string(subject_temp_path, subject_dto)
            subject = ''.join(subject.splitlines())
            email = loader.render_to_string(email_temp_path, subject_dto)
            try:
                message = EmailMessage(subject, email, to=[user.email])
                message.send()
            except Exception as e:
                print(e)
            return HttpResponse(status=200)
          except Exception as e:
                  print(e)
          return HttpResponse(status=404)
      else:
          return HttpResponse(status=404)

    @action(methods=['get'], detail=False)
    def send_activation_email(self, request):
      try:
        qu_id = request.query_params.get('id')
        users = get_user_model().objects.filter(id=qu_id)
        if len(users) > 0:
          try:
            message = EmailMessage('Account Activation Status', 'Congrats your account is activated successfully.', to=[users[0].email])
            message.send()
          except:
            return Response({'status_code': '400', 'detail': 'sending email failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
          return Response({'status_code': '400', 'detail': 'user doesnt exists'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'status_code': '200', 'detail': 'email sent successfully'}, status = status.HTTP_200_OK)
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
    def is_schedule_exist(self, request):
      try:
        qu_id = request.query_params.get('id')
        qu_user_id = request.query_params.get('user_id')
        qu_opening_time = request.query_params.get('opening_time')
        qu_closing_time = request.query_params.get('closing_time')
        qu_day_of_week = request.query_params.get('day_of_week')
        schedules = Schedule.objects.filter(user=qu_user_id,day_of_week=qu_day_of_week)
        if qu_id != 0:
          schedules = schedules.filter(~Q(id=qu_id))
        is_exist = schedules.filter(opening_time__gte=qu_opening_time,opening_time__lte=qu_closing_time).exists()
        if is_exist == False:
          is_exist = schedules.filter(closing_time__gte=qu_opening_time,closing_time__lte=qu_closing_time).exists()
        if is_exist == False:
           return Response({'status_code': '200', 'detail': 'Schedule doesnt exist'}, status = status.HTTP_200_OK)
        else:
          return Response({'status_code': '400', 'detail': 'Schedule already exist in the given range.'}, status = status.HTTP_400_BAD_REQUEST)
      except Exception:
          return Response({'status_code': '500', 'detail': 'Something went wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(methods=['get'], detail=False)
    def unbooked_slots(self, request):
      try:
        qu_requested_date = request.query_params.get('requested_date')
        qu_user_id = request.query_params.get('user_id')
        req_day_name = parse_date(qu_requested_date).strftime("%A")
        start_date = parse_date(qu_requested_date)
        schedules = Schedule.objects.filter(user=qu_user_id, day=req_day_name)
        appointments = Appointment.objects.filter(therapist=qu_user_id, slot_date__gte=start_date, status_type__lte=1)
        unbooked_sch = []
        if schedules.exists():
          for s in schedules:
            open_tim = datetime.combine(start_date, s.opening_time)
            clos_tim = datetime.combine(start_date, s.closing_time)
            is_exits = appointments.filter(slot_start_time__gte=open_tim, slot_start_time__lte=clos_tim).exists()
            if is_exits == False:
              is_exits = appointments.filter(slot_end_time__gte=open_tim, slot_end_time__lte=clos_tim).exists()
            if is_exits == False:
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
      appointments = Appointment.objects.filter(client=qu_user_id).order_by('-id')
      serializer = AppoitmentUserSerializer(appointments, many=True)
      return Response(serializer.data, status = status.HTTP_200_OK)
    except Exception:
        return Response({'status_code': '500', 'detail': 'Something went wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

  @action(methods=['get'], detail=False)
  def appointments_to_therapist(self, request):
    try:
      qu_user_id = request.query_params.get('user_id')
      appointments = Appointment.objects.filter(therapist=qu_user_id).order_by('-id')
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
      is_appointment_exist = Appointment.objects.filter(therapist=schedule.user, slot_date=qu_requested_date, slot_start_time__gte=open_tim, slot_end_time__lte=clos_tim, status_type__lte=1).exists()
      return Response({'result': is_appointment_exist}, status = status.HTTP_200_OK)
    except Exception:
        return Response({'status_code': '500', 'detail': 'Something went wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

  @action(methods=['get'], detail=False)
  def send_email_by_status(self, request):
    try:
      qu_appointment_id = request.query_params.get('appointment_id')
      print(qu_appointment_id)
      print('i am in appointment')
      appointments = Appointment.objects.filter(id=qu_appointment_id)
      if len(appointments) > 0:
        header = 'Information about your appointment no ' + str(appointments[0].id)
        client_body = ''
        therapist_body = ''
        is_send_therapist = False
        if appointments[0].status_type == 0: #waiting
          client_body = 'Thanks for you appointment.'
          therapist_body = 'You have new appointment'
          is_send_therapist = True
        elif appointments[0].status_type == 1: # Accepted
          client_body = 'Congrats your appointment is accepted'
          is_send_therapist = False
        elif appointments[0].status_type == 2: #Completed
          client_body = 'Session had completed successfully'
          therapist_body = 'Session had completed successfully'
          is_send_therapist = True
        elif appointments[0].status_type == 3: # Cancelled By Therapist
          client_body = 'Appointment cancelled by therapist'
          therapist_body = 'You have cancelled the appointment'
          is_send_therapist = True
        elif appointments[0].status_type == 4: #  Cancelled by Client
          client_body = 'You have cancelled the appointment'
          therapist_body = 'Appointment cancelled by client'
          is_send_therapist = True
        try:
          users = list()
          user = get_user_model().objects.get(email=appointments[0].client)
          users.append(user)
          if is_send_therapist == True:
            user = get_user_model().objects.get(email=appointments[0].therapist)
            users.append(user)
          for i in range(len(users)):
            main_body = client_body
            if is_send_therapist and users[i].role_type == 'therapist':
              main_body = therapist_body
            message = EmailMessage(header, main_body, to=[users[i].email])
            message.send()
            print(main_body)
        except:
          return Response({'status_code': '500', 'detail': 'Something went wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
      else:
        return Response({'status_code': '400', 'detail': 'Appointment doesnt exists'}, status=status.HTTP_400_BAD_REQUEST)
      return Response({'status_code': '200', 'detail': 'email sent successfully'}, status = status.HTTP_200_OK)
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

  @action(methods=['get'], detail=False)
  def payments_by_therapist_id(self, request):
    try:
      qu_therapist_id = request.query_params.get('therapist_id')
      payment = PaymentTransaction.objects.filter(therapist=qu_therapist_id)
      serializer = PaymentTransactionSerializer(payment, many=True)
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

class NotepadViewSet(viewsets.ModelViewSet):
  queryset = Notepad.objects.all()
  serializer_class = NotepadSerializer
  permission_classes = (IsAuthenticated,)
  http_method_names = ['get','post', 'put', 'delete']

  @action(methods=['get'], detail=False)
  def notepads_by_user_id(self, request):
    try:
      qu_user_id = request.query_params.get('user_id')
      notepads = Notepad.objects.filter(user=qu_user_id)
      serializer = NotepadSerializer(notepads, many=True)
      return Response(serializer.data, status = status.HTTP_200_OK)
    except Exception:
        return Response({'status_code': '500', 'detail': 'Something went wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class FavouriteTherapistViewSet(viewsets.ModelViewSet):
  queryset = FavouriteTherapist.objects.all()
  serializer_class = FavouriteTherapistSerializer
  # permission_classes = (IsAuthenticated,)
  http_method_names =  ['get','post', 'delete']

  @action(methods=['get'], detail=False)
  def therapists_by_client_id(self, request):
    try:
      qu_client_id = request.query_params.get('client_id')
      fav_therapists = FavouriteTherapist.objects.filter(client=qu_client_id)
      serializer = FavouriteTherapistDtoSerializer(fav_therapists, many=True)
      return Response(serializer.data, status = status.HTTP_200_OK)
    except Exception:
        return Response({'status_code': '500', 'detail': 'Something went wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
  
  @action(methods=['get'], detail=False)
  def fav_by_therapist_id(self, request):
    try:
      qu_client_id = request.query_params.get('client_id')
      qu_therapist_id = request.query_params.get('therapist_id')
      try :
        fav_therapist = FavouriteTherapist.objects.get(client=qu_client_id, therapist=qu_therapist_id)
        serializer = FavouriteTherapistDtoSerializer(fav_therapist, many=False)
        return Response(serializer.data, status = status.HTTP_200_OK)
      except ObjectDoesNotExist:
        return Response({'status_code': '400', 'detail': 'This therapist is not assigned as favourite'}, status=status.HTTP_404_NOT_FOUND)
    except Exception:
        return Response({'status_code': '500', 'detail': 'Something went wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CustomerContactEnquiryViewSet(viewsets.ModelViewSet):
  queryset = CustomerContactEnquiry.objects.all()
  serializer_class = CustomerContactEnquirySerializer
  http_method_names = ['get','post', 'put']

  @action(methods=['get'], detail=False)
  def send_reply_email(self, request):
    try:
      qu_id = request.query_params.get('id')
      enquiry = CustomerContactEnquiry.objects.filter(id=qu_id)
      if len(enquiry) > 0:
        try:
          print(enquiry[0].admin_reply_message)
          print(enquiry[0].email_address)
          message = EmailMessage('Reply for you enquiry', enquiry[0].admin_reply_message, to=[enquiry[0].email_address])
          message.send()
        except:
          return Response({'status_code': '400', 'detail': 'sending email failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
      else:
        return Response({'status_code': '400', 'detail': 'Enquiry doesnt exists'}, status=status.HTTP_400_BAD_REQUEST)
      return Response({'status_code': '200', 'detail': 'email sent successfully'}, status = status.HTTP_200_OK)
    except Exception:
        return Response({'status_code': '500', 'detail': 'Something went wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)