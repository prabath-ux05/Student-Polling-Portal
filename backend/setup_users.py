import os
import sys

sys.path.append(r'c:\Documents\Desktop Files\EduResponse AI\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

import django
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()
User.objects.create_superuser('admin', 'admin@example.com', 'admin')
User.objects.create_user(username='faculty1', email='faculty1@example.com', password='password123', role='FACULTY')
User.objects.create_user(username='student1', email='student1@example.com', password='password123', role='STUDENT')
print('Users created.')
