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
        print("=== PUT REMEDIO ===")
        print(f"PK recebido: {pk}")
        print(f"User autenticado: {request.user}")
        print(f"User ID: {request.user.id}")
        print(f"Data recebida: {request.data}")
        print(f"Headers: {dict(request.headers)}")
        
        try:
            remedio = Remedio.objects.get(pk=pk, usuario=request.user)
            print(f"Remédio encontrado: {remedio.name} (ID: {remedio.id})")
            print(f"Dados atuais do remédio:")
            print(f"  - name: {remedio.name}")
            print(f"  - dosage: {remedio.dosage}")
            print(f"  - day: {remedio.day}")
            print(f"  - time: {remedio.time}")
            print(f"  - usuario_id: {remedio.usuario_id}")
        except Remedio.DoesNotExist:
            print(f"ERRO: Remédio com pk={pk} não encontrado para o usuário {request.user}")
            # Verifica se o remédio existe mas para outro usuário
            try:
                remedio_outro = Remedio.objects.get(pk=pk)
                print(f"ATENÇÃO: Remédio existe mas pertence ao usuário {remedio_outro.usuario_id}")
            except Remedio.DoesNotExist:
                print(f"Remédio com pk={pk} não existe no banco")
            return Response({"error": "Remédio não encontrado"}, status=status.HTTP_404_NOT_FOUND)

        print("\n--- Validando serializer ---")
        serializer = RemedioSerializer(remedio, data=request.data)
        is_valid = serializer.is_valid()
        print(f"Serializer válido? {is_valid}")
        
        if is_valid:
            print(f"Dados validados: {serializer.validated_data}")
            try:
                updated_remedio = serializer.save(usuario=request.user)
                print(f"Remédio atualizado com sucesso!")
                print(f"Novos dados:")
                print(f"  - name: {updated_remedio.name}")
                print(f"  - dosage: {updated_remedio.dosage}")
                print(f"  - day: {updated_remedio.day}")
                print(f"  - time: {updated_remedio.time}")
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Exception as e:
                print(f"ERRO ao salvar: {type(e).__name__}: {str(e)}")
                import traceback
                print(traceback.format_exc())
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            print(f"Erros de validação: {serializer.errors}")
            print(f"Detalhes dos erros:")
            for field, errors in serializer.errors.items():
                print(f"  - {field}: {errors}")
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, pk):
        print("=== PATCH REMEDIO ===")
        print(f"PK recebido: {pk}")
        print(f"User autenticado: {request.user}")
        print(f"Data recebida (partial): {request.data}")
        
        try:
            remedio = Remedio.objects.get(pk=pk, usuario=request.user)
            print(f"Remédio encontrado: {remedio.name} (ID: {remedio.id})")
        except Remedio.DoesNotExist:
            print(f"ERRO: Remédio com pk={pk} não encontrado")
            return Response({"error": "Remédio não encontrado"}, status=status.HTTP_404_NOT_FOUND)

        print("\n--- Validando serializer (partial=True) ---")
        serializer = RemedioSerializer(remedio, data=request.data, partial=True)
        is_valid = serializer.is_valid()
        print(f"Serializer válido? {is_valid}")
        
        if is_valid:
            print(f"Dados validados: {serializer.validated_data}")
            try:
                updated_remedio = serializer.save(usuario=request.user)
                print(f"Remédio atualizado com sucesso (PATCH)!")
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Exception as e:
                print(f"ERRO ao salvar: {type(e).__name__}: {str(e)}")
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            print(f"Erros de validação: {serializer.errors}")
        
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