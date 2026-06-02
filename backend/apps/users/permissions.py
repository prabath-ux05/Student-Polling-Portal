from rest_framework import permissions

class IsAdminUserRole(permissions.BasePermission):
    """
    Allows access only to admin users based on custom role field.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'ADMIN')

class IsFacultyOrAdmin(permissions.BasePermission):
    """
    Allows access to both Faculty and Admin roles.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ['ADMIN', 'FACULTY'])

class IsAdminOrSelf(permissions.BasePermission):
    """
    Allows admins to access/edit any user, but normal users can only access/edit themselves.
    """
    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False
        if request.user.role == 'ADMIN':
            return True
        return obj == request.user
