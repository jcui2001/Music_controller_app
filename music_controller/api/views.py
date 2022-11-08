from django.shortcuts import render
from rest_framework import generics
from .serializers import RoomSerializer, CreateRoomSerializer, UpdateRoomSerializer
from .models import Room
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse

# Create your views here.

# Write API view
# Allows us to view & create rooms


class RoomView(generics.CreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class GetRoom(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = 'code'

    def get(self, request, format=None):
        # looks up 'code'
        code = request.GET.get(self.lookup_url_kwarg)
        if code != None:
            room = Room.objects.filter(code=code)
            if len(room) > 0:
                # serialize the room and extract the data from the Serializer
                data = RoomSerializer(room[0]).data
                # checks all existing rooms and checks does this session key match the host id?
                data['is_host'] = self.request.session.session_key == room[0].host
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Room Not Found': 'Invalid Room Code.'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'Bad Request': 'Code paramenter not found in request.'},
                        status=status.HTTP_400_BAD_REQUEST)


class JoinRoom(APIView):
    lookup_url_kwarg = 'code'

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        code = request.data.get(self.lookup_url_kwarg)
        if code != None:
            # checks if there is an existing room code
            room_result = Room.objects.filter(code=code)
            if len(room_result) > 0:
                room = room_result[0]
                # stores the room code so that you can check if a user is in a room and can be returned to that room
                self.request.session['room_code'] = code
                return Response({'message': 'Room Joined!'}, status=status.HTTP_200_OK)

            return Response({'Bad Request': 'Invalid Room Code'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'Bad Request': "Invalid post data, did not find a code key."}, status=status.HTTP_400_BAD_REQUEST)


class UserInRoom(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        data = {
            'code': self.request.session.get('room_code')
        }
        return JsonResponse(data, status=status.HTTP_200_OK)


class CreateRoomView(APIView):
    # allows us to avoid rewriting methods
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        # does this user key have a current session?
        if not self.request.session.exists(self.request.session.session_key):
            # create a session
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            host = self.request.session.session_key
        # what if a room does exist?
        # we'll send the new conditions to the existing room

            # checks if any existing room matches the one sent
            # set that existing room with the new arguments
            queryset = Room.objects.filter(host=host)
            if queryset.exists():
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                # you have to update the existing field with new args
                room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
                self.request.session['room_code'] = room
                return Response(RoomSerializer(room.data, status=status.HTTP_200_OK))
            # else, create a new room
            else:
                room = Room(host=host, guest_can_pause=guest_can_pause,
                            votes_to_skip=votes_to_skip)
                room.save()
                # stores room code
                self.request.session['room_code'] = room.code
            return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)


class LeaveRoom(APIView):
    def post(self, request, format=None):
        if 'room_code' in self.request.session:
            # removes user code from this session
            code = self.request.session.pop('room_code')
            # checks if they are the host of that room
            host_id = self.request.session.session_key
            room_results = Room.objects.filter(host=host_id)
            # if they are, delete the room
            if len(room_results) > 0:
                room = room_results[0]
                room.delete()

        return Response({'Message': 'Successfully deleted room.'}, status=status.HTTP_200_OK)


class UpdateRoom(APIView):
    serializer = UpdateRoomSerializer

    def path(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            code = serializer.data.get('code')

            queryset = Room.objects.filter(code=code)
            # use .exists() to check if the response returned anything
            # this is standard practice
            if not queryset.exists():
                return Response({'msg': 'Room not found.'}, status=status.HTTP_404_NOT_FOUND)

            room = queryset[0]
            user_id = self.request.session.session_key
            if room.host != user_id:
                return Response({'msg': 'You are not the host of this room.'}, status=status.HTTP_404_NOT_FOUND)

            room.guest_can_pause = guest_can_pause
            room.votes_to_skip = votes_to_skip
            room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
            return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)

        return Response({'Bad Request': "Invalid Data..."}, status=status.HTTP_400_BAD_REQUEST)
# whenever we connect to a website we create a session
# a period from signing in to signing out of Facebook is a session
# sessions can carry over after closing the page
