# mural/serializers.py
from rest_framework import serializers
from .models import Post, Profile
from django.contrib.auth.models import User


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['avatar', 'bio']


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

    autor_avatar = serializers.ReadOnlyField(source='autor.perfil.avatar.url')

    class Meta:
        model = Post
        fields = '__all__'
        # ESTA ES LA LÍNEA MÁGICA:
        # Le dice a Django: "El autor no vendrá en el formulario, es de solo lectura"
        read_only_fields = ['autor']
