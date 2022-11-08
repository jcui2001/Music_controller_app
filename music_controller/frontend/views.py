from django.shortcuts import render

# Create your views here.
# render the django template

# render the index.html
# second arg is the address of the index.html


def index(request, *args, **kwargs):
    return render(request, 'frontend/index.html')
