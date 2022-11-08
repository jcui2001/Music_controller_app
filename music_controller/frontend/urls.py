from django.urls import path
from .views import index

# creates path to the index.html when these paths are used
# 127.0.
urlpatterns = [
    path('', index),
    path('join', index),
    path('create', index),
    path('room/<str:roomCode>', index)
]
