# mural/views.py
from rest_framework import viewsets, permissions, generics
from .models import Post, Profile
from .serializers import PostSerializer, UserSerializer, ProfileSerializer
from django.contrib.auth.models import User


class MyProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Esto asegura que cada usuario solo vea y edite SU propio perfil
        return self.request.user.perfil


# 1. Vista para Registrar Usuarios (Sign Up)
class SignUpView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny] # Cualquiera puede registrarse

# 2. Vista de Posts (Mural)
class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    # Solo usuarios logueados pueden ver y publicar
    permission_classes = [permissions.IsAuthenticated] 

    def perform_create(self, serializer):
        # ¡AQUÍ ESTÁ EL CAMBIO!
        # Ya no usamos User.objects.first(). Usamos self.request.user
        # que es el usuario que envió el Token válido.
        serializer.save(autor=self.request.user)