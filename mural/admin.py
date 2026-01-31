# mural/admin.py
from django.contrib import admin
from .models import Post

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'autor', 'tipo', 'fecha_creacion', 'ubicacion_origen')
    list_filter = ('tipo', 'fecha_creacion', 'autor')
    search_fields = ('titulo', 'contenido_texto', 'ubicacion_origen')