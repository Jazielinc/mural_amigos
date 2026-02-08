# mural/views.py
from rest_framework import viewsets, permissions, generics
from .models import Post, Profile, Comment
from .serializers import PostSerializer, UserSerializer, ProfileSerializer, CommentSerializer
from django.contrib.auth.models import User


class IsAuthorOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow authors of an object to edit or delete it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the author of the post.
        return obj.autor == request.user


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
    # Solo usuarios logueados pueden ver y publicar. Además, solo el autor puede editar/borrar.
    permission_classes = [permissions.IsAuthenticated, IsAuthorOrReadOnly]

    def perform_create(self, serializer):
        # ¡AQUÍ ESTÁ EL CAMBIO!
        # Ya no usamos User.objects.first(). Usamos self.request.user
        # que es el usuario que envió el Token válido.
        serializer.save(autor=self.request.user)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated, IsAuthorOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(autor=self.request.user)