# apps/users/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from .models import UserProfile

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    birthday = serializers.DateField(write_only=True)
    gender = serializers.CharField(write_only=True)
    phone = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password", "birthday", "gender", "phone"]

    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Este username já está em uso.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este email já está em uso.")
        return value

    def validate(self, data):
        required_fields = ["username", "email", "password", "birthday", "gender", "phone"]
        for field in required_fields:
            if not data.get(field):
                raise serializers.ValidationError({field: "Este campo é obrigatório."})
        return data

    def create(self, validated_data):
        birthday = validated_data.pop("birthday")
        gender = validated_data.pop("gender")
        phone = validated_data.pop("phone")
        email = validated_data.pop("email")
        validated_data["password"] = make_password(validated_data["password"])
        user = User.objects.create(**validated_data)

        UserProfile.objects.create(
            user=user,
            email=email,
            birthday=birthday,
            gender=gender,
            phone=phone
        )

        return user