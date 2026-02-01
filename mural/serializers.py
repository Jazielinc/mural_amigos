# mural/serializers.py
from rest_framework import serializers
from .models import Post, Profile, Comment
from django.contrib.auth.models import User


class ProfileSerializer(serializers.ModelSerializer):
    user_id = serializers.ReadOnlyField(source='user.id')
    username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Profile
        fields = ['user_id', 'username', 'avatar', 'bio']


class CommentSerializer(serializers.ModelSerializer):
    autor_nombre = serializers.ReadOnlyField(source='autor.username')

    class Meta:
        model = Comment
        fields = ['id', 'post', 'autor', 'autor_nombre', 'texto', 'fecha_creacion']
        read_only_fields = ['autor']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}} # Para no mostrar la contraseña al responder

    def create(self, validated_data):
        # Esta función crea el usuario encriptando la contraseña correctamente
        user = User.objects.create_user(**validated_data)
        return user


class PostSerializer(serializers.ModelSerializer):
    autor_nombre = serializers.ReadOnlyField(source='autor.username')
    autor_avatar = serializers.SerializerMethodField()
    comentarios = CommentSerializer(many=True, read_only=True)

    def get_autor_avatar(self, obj):
        if hasattr(obj.autor, 'perfil') and obj.autor.perfil.avatar:
            return obj.autor.perfil.avatar.url
        return None

    class Meta:
        model = Post
        fields = '__all__'
        # ESTA ES LA LÍNEA MÁGICA:
        # Le dice a Django: "El autor no vendrá en el formulario, es de solo lectura"
        read_only_fields = ['autor']
