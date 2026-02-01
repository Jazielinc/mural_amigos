from django.contrib import admin
from .models import Post, Profile  # <--- Importa Profile

admin.site.register(Post)
admin.site.register(Profile) # <--- Regístralo