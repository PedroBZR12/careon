from django.contrib.auth.models import User, AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.contrib.auth.hashers import make_password
from rest_framework import serializers

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    email = models.EmailField(default='')
    gender = models.CharField(max_length=20)
    birthday = models.DateField()
    phone = models.CharField(max_length=20)
    avatar_url = models.URLField(max_length=500, null=True, blank=True)
    
    def __str__(self):
        return self.user.username
    class Meta:
        db_table = 'perfis'
        
