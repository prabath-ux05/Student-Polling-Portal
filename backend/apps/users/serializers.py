from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'role', 'first_name', 'last_name')

    def get_fields(self):
        fields = super().get_fields()
        request = self.context.get('request')
        # Only admins can update email or role
        if request and getattr(request.user, 'role', None) != 'ADMIN':
            fields['role'].read_only = True
            fields['email'].read_only = True
        return fields

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.CharField(required=False, default='STUDENT')

    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'role', 'first_name', 'last_name')

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
            role=validated_data.get('role', User.Role.STUDENT),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user
