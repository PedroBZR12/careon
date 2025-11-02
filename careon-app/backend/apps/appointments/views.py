from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from .models import Compromisso
from .serializers import CompromissoSerializer

class CompromissoListCreateAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        print("=== GET COMPROMISSOS ===")
        print(f"User: {request.user}")
        compromissos = Compromisso.objects.filter(usuario=request.user)
        print(f"Compromissos encontrados: {compromissos.count()}")
        serializer = CompromissoSerializer(compromissos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        print("=== POST COMPROMISSO ===")
        print(f"User autenticado: {request.user}")
        print(f"User is_authenticated: {request.user.is_authenticated}")
        print(f"Data recebida: {request.data}")
        print(f"Headers: {request.headers}")
        
        serializer = CompromissoSerializer(data=request.data)
        print(f"Serializer válido? {serializer.is_valid()}")
        
        if serializer.is_valid():
            print(f"Dados validados: {serializer.validated_data}")
            try:
                compromisso = serializer.save(usuario=request.user)
                print(f"Compromisso salvo com ID: {compromisso.id}")
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                print(f"ERRO ao salvar: {e}")
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            print(f"Erros do serializer: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CompromissoDetailAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk, user):
        return get_object_or_404(Compromisso, pk=pk, usuario=user)

    def get(self, request, pk):
        compromisso = self.get_object(pk, request.user)
        serializer = CompromissoSerializer(compromisso)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        compromisso = self.get_object(pk, request.user)
        serializer = CompromissoSerializer(compromisso, data=request.data)
        if serializer.is_valid():
            serializer.save(usuario=request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        compromisso = self.get_object(pk, request.user)
        compromisso.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
