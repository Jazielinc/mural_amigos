# mural/models.py
from django.db import models
from django.contrib.auth.models import User

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
    
    # Archivos multimedia (requieren configuración de MEDIA_URL más adelante)
    imagen = models.ImageField(upload_to='mural/fotos/', blank=True, null=True)
    video = models.FileField(upload_to='mural/videos/', blank=True, null=True)
    
    # Redes sociales
    url_externa = models.URLField(blank=True, null=True)
    
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    ubicacion_origen = models.CharField(max_length=100, help_text="Ciudad/País desde donde se publica")

    class Meta:
        ordering = ['-fecha_creacion'] # Lo más reciente primero

    def __str__(self):
        return f"{self.titulo or 'Sin título'} - {self.autor.username}"