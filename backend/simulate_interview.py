import requests
import json
import time

BASE_URL = 'http://127.0.0.1:8000/api'

def run():
    print('Starting Interview Simulator Validation Flow...')
    
    username = f'strong_candidate_{int(time.time())}'
    email = f'{username}@example.com'
    password = 'strongpassword123'
    
    register_data = {
        'username': username,
        'email': email,
        'password': password,
        'role': 'STUDENT'
    }
    
    print('1. Registering User')
    reg_resp = requests.post(f'{BASE_URL}/auth/register/', json=register_data)
    if reg_resp.status_code != 201:
        print(f'Registration failed: {reg_resp.text}')
        return
        
    print('2. Getting Token')
    login_resp = requests.post(f'{BASE_URL}/auth/login/', json={'email': email, 'password': password})
    if login_resp.status_code != 200:
        print(f'Login failed: {login_resp.text}')
        return
        
    token = login_resp.json().get('access')
    headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
    
    print('3. Starting Interview')
    start_data = {
        'target_role': 'Senior Backend Engineer',
        'skills': ['Python', 'Django', 'PostgreSQL', 'Redis', 'Docker', 'System Design'],
        'difficulty': 'HARD'
    }
    
    start_resp = requests.post(f'{BASE_URL}/interviews/start/', json=start_data, headers=headers)
    if start_resp.status_code != 200:
        print(f'Start failed: {start_resp.text}')
        return
        
    session_id = start_resp.json().get('session_id')
    question = start_resp.json().get('question')
    print(f'Session ID: {session_id}')
    print(f'Initial Question: {question}')
    
    for i in range(1, 11):
        print(f'\n--- Question {i} ---')
        
        answer = "I would design the system using a microservices architecture with Django for the API layer, PostgreSQL for relational data, and Redis for caching. I'd ensure horizontal scalability by deploying containerized services via Docker and Kubernetes behind a load balancer. For asynchronous tasks, I'd use Celery with a RabbitMQ broker to ensure high throughput and fault tolerance."
        
        ans_data = {
            'session_id': session_id,
            'answer': answer
        }
        
        ans_resp = requests.post(f'{BASE_URL}/interviews/answer/', json=ans_data, headers=headers)
        if ans_resp.status_code != 200:
            print(f'Answer {i} failed: {ans_resp.text}')
            return
            
        data = ans_resp.json()
        print(f"Feedback Score: {data.get('feedback', {}).get('score')}")
        print(f"Strengths: {data.get('feedback', {}).get('strengths')}")
        print(f"Weaknesses: {data.get('feedback', {}).get('weaknesses')}")
        print(f"Improvements: {data.get('feedback', {}).get('improvements')}")
        print(f"Next Question: {data.get('next_question')}")
        print(f"Is Completed: {data.get('is_completed')}")
        
    print('\n5. Fetching Analytics')
    analytics_resp = requests.get(f'{BASE_URL}/interviews/analytics/{session_id}/', headers=headers)
    if analytics_resp.status_code != 200:
        print(f'Analytics failed: {analytics_resp.text}')
        return
        
    analytics = analytics_resp.json()
    print(json.dumps(analytics, indent=2))

if __name__ == '__main__':
    run()
