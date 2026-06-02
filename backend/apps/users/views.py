from rest_framework import generics, permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, RegisterSerializer
from .permissions import IsAdminUserRole, IsAdminOrSelf

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class CurrentUserView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        serializer = UserSerializer(request.user, context={'request': request})
        return Response(serializer.data)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == 'list':
            # Only admins can view the full list of users
            permission_classes = [IsAdminUserRole]
        elif self.action in ['retrieve', 'update', 'partial_update']:
            # Users can view/edit themselves, Admins can view/edit anyone
            permission_classes = [IsAdminOrSelf]
        else:
            # Block create and destroy for normal users. Admins can manage fully.
            permission_classes = [IsAdminUserRole]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = super().get_queryset()
        # Allow admins to filter by role (e.g. ?role=STUDENT)
        role = self.request.query_params.get('role', None)
        if role:
            queryset = queryset.filter(role=role.upper())
        return queryset
