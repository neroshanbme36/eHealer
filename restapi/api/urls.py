from django.urls import path
from rest_framework import routers
from django.conf.urls import include
from .views import UserViewSet, UserUpdateViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


router = routers.DefaultRouter()
router.register('users', UserViewSet)
router.register('updateuser', UserUpdateViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
