from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

User = get_user_model()

class CaseInsensitiveModelBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        if username is None:
            username = kwargs.get(User.USERNAME_FIELD)
        
        username = username.strip() if username else None
        
        try:
            case_insensitive_username_field = '{}__iexact'.format(User.USERNAME_FIELD)
            user = User.objects.get(**{case_insensitive_username_field: username})
        except User.DoesNotExist:
            # Run the default password hasher once to reduce the timing difference
            User().set_password(password)
            return None
            
        except User.MultipleObjectsReturned:
            user = User.objects.filter(**{case_insensitive_username_field: username}).order_by('id').first()
        
        if user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None
