from django.urls import path
from .views import CompromissoListCreateAPIView, CompromissoDetailAPIView

urlpatterns = [
    path('', CompromissoListCreateAPIView.as_view(), name='compromisso-list-create'),
    path('<int:pk>/', CompromissoDetailAPIView.as_view(), name='compromisso-detail'),
]