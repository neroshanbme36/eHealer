from django.urls import path
from rest_framework import routers
from django.conf.urls import include
from .views import PaymentViewSet, SessionViewSet, UserViewSet, UserUpdateViewSet, ScheduleViewSet, TherapistFeeViewSet, AppointmentViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


router = routers.DefaultRouter()
router.register('users', UserViewSet)
router.register('update_user', UserUpdateViewSet)
router.register('schedules', ScheduleViewSet)
router.register('therapist_fees', TherapistFeeViewSet)
router.register('appointments', AppointmentViewSet)
router.register('sessions', SessionViewSet)
router.register('payments', PaymentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
