# mural/views.py
from rest_framework import viewsets, permissions, generics
from .models import Post
from .serializers import PostSerializer, UserSerializer
from django.contrib.auth.models import User

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