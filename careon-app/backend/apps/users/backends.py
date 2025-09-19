from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from apps.users.models import UserProfile  # ajuste o nome da classe se for diferente

User = get_user_model()

class EmailFromProfileBackend(ModelBackend):
    """
    Autenticação usando o email armazenado no Profile (apps.users.models).
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        email = kwargs.get("email", username)
        if email is None or password is None:
            return None

        try:
            # Busca o perfil pelo email
            profile = UserProfile.objects.get(email=email)
            user = profile.user  # pega o usuário vinculado ao perfil
        except UserProfile.DoesNotExist:
            return None

        # Valida senha e se o usuário pode autenticar
        if user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None
