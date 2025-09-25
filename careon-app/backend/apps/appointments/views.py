from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Compromisso
from .serializers import CompromissoSerialize


# Create your views here.
