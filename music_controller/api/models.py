from django.db import models
import string
import random

# Create your models here.
# django can interpret python

def generate_unique_code():
    length = 6

    # generates unique random code of max length 6
    while True:
        # generate new code
        code = ''.join(random.choices(string.ascii_uppercase, k=length))
        # filters for code in objects of Room
        if Room.objects.filter(code=code).count() == 0:
            break
        
    return code

class Room(models.Model):
    code = models.CharField(
        max_length=10, default=generate_unique_code, unique=True)
    # stores info linked to the host
    host = models.CharField(max_length=50, unique=True)
    guest_can_pause = models.BooleanField(null=False)
    votes_to_skip = models.IntegerField(null=False, default=1)
    # auto_now_add adds the time for right now
    created_at = models.DateTimeField(auto_now_add=True)

    # WE WANT FAST MODELS AND THIN VIEWS
    # use more logic in the MODELS
