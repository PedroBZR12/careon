
from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect
from rest_framework.authtoken.views import obtain_auth_token

def redirect_to_appointments(request):
    return redirect('appointments/')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('appointments/', include('apps.appointments.urls')),
    path('medications/', include('apps.medications.urls')), 
    path('users/', include('apps.users.urls')),
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),
    path('', redirect_to_appointments, name='home'),
]
