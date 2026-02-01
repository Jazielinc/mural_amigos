# mural/models.py
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save # <--- NUEVO
from django.dispatch import receiver       # <--- NUEVO

# --- Tu modelo POST existente (sin cambios) ---
class Post(models.Model):
    TIPO_CONTENIDO = [
        ('TEXTO', 'Publicación de Texto'),
        ('IMAGEN', 'Foto/Imagen'),
        ('VIDEO', 'Video'),
        ('LINK', 'Enlace (Instagram/Facebook/X)'),
    ]
    autor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='publicaciones')
    tipo = models.CharField(max_length=10, choices=TIPO_CONTENIDO, default='TEXTO')
    titulo = models.CharField(max_length=200, blank=True)
    contenido_texto = models.TextField(blank=True)
    imagen = models.ImageField(upload_to='mural/fotos/', blank=True, null=True)
    video = models.FileField(upload_to='mural/videos/', blank=True, null=True)
    url_externa = models.URLField(blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    ubicacion_origen = models.CharField(max_length=100, help_text="Ciudad/País")

    class Meta:
        ordering = ['-fecha_creacion']

    def __str__(self):
        return f"{self.titulo or 'Sin título'} - {self.autor.username}"

# --- NUEVO MODELO PERFIL ---
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='perfil')
    avatar = models.ImageField(upload_to='perfiles/', null=True, blank=True)
    bio = models.TextField(blank=True, help_text="Descripción corta del usuario")

    def __str__(self):
        return f'Perfil de {self.user.username}'

# --- SEÑALES (MAGIA AUTOMÁTICA) ---
# Esto crea un perfil automáticamente cuando un usuario se registra
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    # Guarda el perfil si el usuario se guarda
    # Usamos try/except por si acaso el perfil no existía (para usuarios viejos)
    try:
        instance.perfil.save()
    except Profile.DoesNotExist:
        Profile.objects.create(user=instance)