# apps/users/serializers.py
from multiprocessing.managers import Token
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from .models import UserProfile
from django.db import models
import random
import string


def generate_username():
    return 'user_' + ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))


def split_name(full_name):
    parts = full_name.strip().split()
    first_name = parts[0]
    last_name = ' '.join(parts[1:]) if len(parts) > 1 else ''
    return first_name, last_name


class UserRegisterSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)
    birthday = serializers.DateField(write_only=True)
    gender = serializers.CharField(write_only=True)
    phone = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["full_name", "email", "password", "birthday", "gender", "phone"]

    

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este email já está em uso.")
        return value

    def validate(self, data):
        required_fields = ["full_name", "email", "password", "birthday", "gender", "phone"]
        for field in required_fields:
            if not data.get(field):
                raise serializers.ValidationError({field: "Este campo é obrigatório."})
        return data

    def create(self, validated_data):
        full_name = validated_data.pop("full_name")
        birthday = validated_data.pop("birthday")
        gender = validated_data.pop("gender")
        phone = validated_data.pop("phone")
        email = validated_data.pop("email")
        password = make_password(validated_data["password"])
        first_name, last_name = split_name(full_name)
        username = generate_username()
        user = User.objects.create(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )

        UserProfile.objects.create(
            user=user,
            email=email,
            birthday=birthday,
            gender=gender,
            phone=phone
        )
        
    
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ["birthday", "gender", "phone", "email", "avatar_url"]


class UserDetailSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ["first_name", "last_name", "email", "profile"]


class UserUpdateSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False)
    birthday = serializers.DateField(required=False)
    gender = serializers.CharField(required=False)
    phone = serializers.CharField(required=False)
    password = serializers.CharField(write_only=True, required=False)
    avatar_url = serializers.URLField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = User
        fields = [
            "first_name",
            "last_name",
            "email",
            "birthday",
            "gender",
            "phone",
            "password",
            "avatar_url",
        ]

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        profile = getattr(instance, "profile", None)
        if profile:
            rep["birthday"] = profile.birthday
            rep["gender"] = profile.gender
            rep["phone"] = profile.phone
            rep["avatar_url"] = profile.avatar_url if profile.avatar_url else None
        return rep

    def update(self, instance, validated_data):
        validated_data.pop("username", None)

        for field in ["first_name", "last_name", "email"]:
            if field in validated_data:
                setattr(instance, field, validated_data[field])

        password = validated_data.get("password")
        if password:
            instance.set_password(password)

        profile = getattr(instance, "profile", None)
        if profile:
            for field in ["birthday", "gender", "phone", "avatar_url"]:
                if field in validated_data:
                    setattr(profile, field, validated_data[field])
            profile.save()

        instance.save()
        return instance



