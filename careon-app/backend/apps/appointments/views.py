from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from .models import Compromisso
from .serializers import CompromissoSerializer

class CompromissoListCreateAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        compromissos = Compromisso.objects.filter(usuario=request.user)
        serializer = CompromissoSerializer(compromissos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = CompromissoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(usuario=request.user)  
            return Response(serializer.data, status=status.HTTP_201_CREATED)
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
