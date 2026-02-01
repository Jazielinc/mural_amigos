# mural/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token # Vista de Login oficial
from .views import PostViewSet, SignUpView, MyProfileView, CommentViewSet

router = DefaultRouter()
router.register(r'posts', PostViewSet)
router.register(r'comments', CommentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', obtain_auth_token, name='api_token_auth'), # URL para Loguearse
    path('signup/', SignUpView.as_view(), name='signup'),     # URL para Registrarse
    path('profile/', MyProfileView.as_view(), name='my_profile'),
]