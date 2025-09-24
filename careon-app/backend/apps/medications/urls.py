from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import RemedioCreateView, RemedioListView, RemedioDeleteView, RemedioUpdateView, DailyChecklistView, MarkMedicationView, BuscarPrecoView



urlpatterns = [
    path('create/', RemedioCreateView.as_view(), name='medication-create'),
    path('', RemedioListView.as_view(), name='remedio-list'),
    path('<int:pk>/delete/', RemedioDeleteView.as_view(), name='remedio-delete'),
    path('<int:pk>/update/', RemedioUpdateView.as_view(), name='remedio-update'),
    path("checklist/", DailyChecklistView.as_view(), name="daily-checklist"),
    path("checklist/mark/", MarkMedicationView.as_view(), name="mark-medication"),
    path("buscar/", BuscarPrecoView.as_view(), name="buscar-preco"),
]
