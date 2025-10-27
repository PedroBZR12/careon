from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, generics
from .models import Remedio, Intake
from .serializers import RemedioSerializer, IntakeSerializer
from datetime import date
from django.utils import timezone
from .services import buscar_preco


class RemedioCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = RemedioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(usuario=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RemedioListView(generics.ListAPIView):
    serializer_class = RemedioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        print("Usuário autenticado:", self.request.user, self.request.user.id)
        return Remedio.objects.filter(usuario=self.request.user)
    
    
class RemedioDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        try:
            remedio = Remedio.objects.get(pk=pk, usuario=request.user)
            remedio.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Remedio.DoesNotExist:
            return Response({"error": "Remédio não encontrado"}, status=status.HTTP_404_NOT_FOUND)
        
class RemedioUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def put(self, request, pk):
        try:
            remedio = Remedio.objects.get(pk=pk, usuario=request.user)
        except Remedio.DoesNotExist:
            return Response({"error": "Remédio não encontrado"}, status=status.HTTP_404_NOT_FOUND)

        serializer = RemedioSerializer(remedio, data=request.data)
        if serializer.is_valid():
            serializer.save(usuario=request.user)  
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, pk):       
        try:
            remedio = Remedio.objects.get(pk=pk, usuario=request.user)
        except Remedio.DoesNotExist:
            return Response({"error": "Remédio não encontrado"}, status=status.HTTP_404_NOT_FOUND)

        serializer = RemedioSerializer(remedio, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(usuario=request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class DailyChecklistView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        today = date.today()
        usuario = request.user
        remedios = Remedio.objects.filter(usuario=usuario)
        intakes = Intake.objects.filter(usuario=usuario, data=today)
        intake_map = {i.remedio_id: i.taken for i in intakes}

       
        data = []
        for r in remedios:
            data.append({
                "id": r.id,
                "name": r.name,
                "dosage": r.dosage,
                "day": r.day,
                "time": r.time,
                "taken": intake_map.get(r.id, False)
            })

        return Response(data, status=status.HTTP_200_OK)


class MarkMedicationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        usuario = request.user
        remedio_id = request.data.get("medication_id")
        taken = request.data.get("taken", True)

        if not remedio_id:
            return Response({"error": "medication_id é obrigatório"}, status=status.HTTP_400_BAD_REQUEST)

        today = date.today()

        intake, created = Intake.objects.get_or_create(
            usuario=usuario,
            remedio_id=remedio_id,
            data=today,
            defaults={"taken": taken, "taken_at": timezone.now()}
        )

        if not created:
            intake.taken = taken
            intake.taken_at = timezone.now() if taken else None
            intake.save()

        serializer = IntakeSerializer(intake)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class BuscarPrecoView(APIView):
    permission_classes = [permissions.AllowAny]  # qualquer um pode buscar

    def get(self, request):
        termo = request.query_params.get("q")
        if not termo:
            return Response({"error": "Parâmetro 'q' é obrigatório"}, status=status.HTTP_400_BAD_REQUEST)

        resultados = buscar_preco(termo)
        return Response(resultados, status=status.HTTP_200_OK)