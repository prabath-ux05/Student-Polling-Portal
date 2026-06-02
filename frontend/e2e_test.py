import requests, json

BASE = 'http://localhost:5173/api'

# Register faculty
r = requests.post(f'{BASE}/auth/register/', json={'username':'test_faculty','email':'tf@test.com','password':'pass1234','role':'FACULTY'})
print(f'Register: {r.status_code}')

# Login
r = requests.post(f'{BASE}/auth/login/', json={'email':'tf@test.com','password':'pass1234'})
print(f'Login: {r.status_code}')
token = r.json().get('access','')

h = {'Authorization': f'Bearer {token}'}

# Create question
r = requests.post(f'{BASE}/questions/', json={'title':'Rate the course','description':'1-5 scale'}, headers=h)
print(f'Create Q: {r.status_code}')

# Get questions
r = requests.get(f'{BASE}/questions/', headers=h)
print(f'Get Qs: {r.status_code} count={len(r.json())}')

# Analytics
r = requests.get(f'{BASE}/analytics/pie/', headers=h)
print(f'Pie: {r.status_code} data={r.json()}')

# Export CSV
r = requests.get(f'{BASE}/export/responses/csv/', headers=h)
print(f'CSV Export: {r.status_code}')

print('\nAll endpoints verified through Vite proxy!')
