from django.urls import path
from .views import RoomView, CreateRoomView, GetRoom, JoinRoom, UserInRoom, LeaveRoom, UpdateRoom
# import class functions

urlpatterns = [
    # path('domain url add on', what to display)
    path('home', RoomView.as_view()),
    path('create-room', CreateRoomView.as_view()),
    path('get-room', GetRoom.as_view()),
    path('join-room', JoinRoom.as_view()),
    path('user-in-room', UserInRoom.as_view()),
    path('leave-room', LeaveRoom.as_view()),
    path('update-room', UpdateRoom.as_view())

]
# you can have multiple endpoints that point to the same thing
# http://127.0.0.1:8000/api/home
# http://127.0.0.1:8000/api/
# lead to the same thing since we have both ENDPOINTS inside
