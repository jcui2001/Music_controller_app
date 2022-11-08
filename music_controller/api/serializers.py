from rest_framework import serializers
from .models import Room

# turns information about Room into JSON for the frontend so it can interpret it

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('id', 'code', 'host', 'guest_can_pause',
                  'votes_to_skip', 'created_at')


class CreateRoomSerializer(serializers.ModelSerializer):
    # This will contain a payload with hidden checks that makes sure the data coming in fits
    # the requirements to create a new room
    class Meta:
        model = Room
        fields = ('guest_can_pause', 'votes_to_skip')


class UpdateRoomSerializer(serializers.ModelSerializer):
    code = serializers.CharField(validators=[])
    # This will contain a payload with hidden checks that makes sure the data coming in fits
    # the requirements to create a new room

    class Meta:
        model = Room
        fields = ('guest_can_pause', 'votes_to_skip', 'code')
