from django.urls import path
from .views import CompromissoListCreateAPIView, CompromissoDetailAPIView

urlpatterns = [
    path('compromissos/', CompromissoListCreateAPIView.as_view(), name='compromisso-list-create'),
    path('compromissos/<int:pk>/', CompromissoDetailAPIView.as_view(), name='compromisso-detail'),
]