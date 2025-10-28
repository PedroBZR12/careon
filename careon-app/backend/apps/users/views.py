from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, permissions
from .serializers import UserRegisterSerializer, UserUpdateSerializer, User
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from apps.users.models import DeviceToken
import random
import string
import logging
from django.db import OperationalError

logger = logging.getLogger(__name__)

# Cadastro
class RegisterView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            Token.objects.filter(user=user).delete()
            token = Token.objects.create(user=user)
            return Response({"token": token.key}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Login
class LoginView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    def post(self, request):
        try:
            email = request.data.get("email")
            password = request.data.get("password")
            logger.debug("Login attempt for email: %s", email)
            print(request.data)
            
            if not email or not password:
                return Response(
                    {"error": "Email e senha são obrigatórios"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            try:
                user = authenticate(request, username=email, password=password)
                if not user:
                    return Response(
                        {"error": "Credenciais inválidas"},
                        status=status.HTTP_401_UNAUTHORIZED
                    )
                
                Token.objects.filter(user=user).delete()
                token = Token.objects.create(user=user)
                return Response({
                    "token": token.key,
                    "user": {                    
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                    }
                }, status=status.HTTP_200_OK)
            except OperationalError:
                logger.exception("Erro de conexão com o banco de dados")
                return Response({"detail": "Erro de conexão com o banco. Tente novamente em instantes."}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except Exception:
            logger.exception("Erro em LoginView.post")
            return Response({"detail": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class UserUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = UserUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user  # só edita a si mesmo




class UserMeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserUpdateSerializer(request.user)
        return Response(serializer.data)

class DeviceTokenView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        token = request.data.get("token")
        if not token:
            return Response({"error": "Token não enviado"}, status=400)
        DeviceToken.objects.update_or_create(user=request.user, defaults={"token": token})
        return Response({"message": "Token salvo com sucesso!"})