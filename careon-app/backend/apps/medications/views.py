from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, generics
from .models import Remedio
from .serializers import RemedioSerializer


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
    
    def patch(self, request, pk):       # se for apenas uma coisa que muda
        try:
            remedio = Remedio.objects.get(pk=pk, usuario=request.user)
        except Remedio.DoesNotExist:
            return Response({"error": "Remédio não encontrado"}, status=status.HTTP_404_NOT_FOUND)

        serializer = RemedioSerializer(remedio, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(usuario=request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    