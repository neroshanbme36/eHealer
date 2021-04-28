from django.urls import path
from rest_framework import routers
from django.conf.urls import include
from .views import CustomerContactEnquiryViewSet, FavouriteTherapistViewSet,NotepadViewSet, PaymentTransactionViewSet, SessionViewSet, UserViewSet, UserUpdateViewSet, ScheduleViewSet, TherapistFeeViewSet, AppointmentViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf.urls.static import static
from django.conf import settings


router = routers.DefaultRouter()
router.register('users', UserViewSet)
router.register('update_user', UserUpdateViewSet)
router.register('schedules', ScheduleViewSet)
router.register('therapist_fees', TherapistFeeViewSet)
router.register('appointments', AppointmentViewSet)
router.register('sessions', SessionViewSet)
router.register('payment_transactions', PaymentTransactionViewSet)
router.register('notepads', NotepadViewSet)
router.register('favourite_therapists', FavouriteTherapistViewSet)
router.register('customer_contact_enquires', CustomerContactEnquiryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh')
]

if settings.DEBUG:
  urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)