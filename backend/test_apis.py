import os
import sys
import json

sys.path.append(r'c:\Documents\Desktop Files\EduResponse AI\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

import django
django.setup()

from django.test import Client
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from apps.academics.models import Question, Response

User = get_user_model()
faculty = User.objects.get(username='faculty1')
student = User.objects.get(username='student1')

faculty_token = str(RefreshToken.for_user(faculty).access_token)
student_token = str(RefreshToken.for_user(student).access_token)

client = Client()

def print_res(name, res):
    print(f"{name}: {res.status_code}")
    if res.status_code >= 400:
        print(res.content.decode('utf-8'))

# Faculty creates question
res = client.post('/api/questions/', {'title': 'Q1', 'description': 'D1'}, HTTP_AUTHORIZATION=f'Bearer {faculty_token}')
print_res("Create Question", res)
q_id = res.json()['id']

# Student views questions
res = client.get('/api/questions/', HTTP_AUTHORIZATION=f'Bearer {student_token}')
print_res("Student Get Questions", res)

# Student submits response
res = client.post('/api/responses/', {'question': q_id, 'answer_text': 'My Answer'}, HTTP_AUTHORIZATION=f'Bearer {student_token}')
print_res("Submit Response", res)

# Faculty views responses
res = client.get('/api/responses/', HTTP_AUTHORIZATION=f'Bearer {faculty_token}')
print_res("Faculty Get Responses", res)

# Faculty exports
res = client.get('/api/export/responses/csv/', HTTP_AUTHORIZATION=f'Bearer {faculty_token}')
print_res("Export CSV", res)
res = client.get('/api/export/responses/pdf/', HTTP_AUTHORIZATION=f'Bearer {faculty_token}')
print_res("Export PDF", res)

# Analytics
res = client.get('/api/analytics/pie/', HTTP_AUTHORIZATION=f'Bearer {faculty_token}')
print_res("Analytics Pie", res)
res = client.get('/api/analytics/bar/', HTTP_AUTHORIZATION=f'Bearer {faculty_token}')
print_res("Analytics Bar", res)
res = client.get('/api/analytics/histogram/', HTTP_AUTHORIZATION=f'Bearer {faculty_token}')
print_res("Analytics Histogram", res)

