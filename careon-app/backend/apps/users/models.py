from django.contrib.auth.models import User, AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.contrib.auth.hashers import make_password
from rest_framework import serializers

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    birthday = models.DateField()
    gender = models.CharField(max_length=20)
    phone = models.CharField(max_length=20)

    def __str__(self):
        return self.user.username
    class Meta:
        db_table = 'perfis'
        
