from django.urls import path
from .views import *

# creates path to the index.html when these paths are used
# 127.0.
urlpatterns = [
    path('get-auth-url', AuthURL.as_view()),
    path('redirect', spotify_callback),
    path('is-authenticated', IsAuthenticated.as_view()),
    path('current-song', CurrentSong.as_view())
]
