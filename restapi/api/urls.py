from django.urls import path
from rest_framework import routers
from django.conf.urls import include
from .views import UserViewSet, UserUpdateViewSet, ScheduleViewSet, TherapistFeeViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


router = routers.DefaultRouter()
router.register('users', UserViewSet)
router.register('update_user', UserUpdateViewSet)
router.register('schedules', ScheduleViewSet)
router.register('therapist_fees', TherapistFeeViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
