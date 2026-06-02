import os
import sys

# Add project root to sys.path
sys.path.append(r'c:\Documents\Desktop Files\EduResponse AI\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

import django
django.setup()

from django.conf import settings
from google import genai
from google.genai.errors import APIError

def run_diagnostics():
    print("=== API KEY DIAGNOSTICS ===")
    
    # Check Environment Variable
    env_key = os.environ.get('GEMINI_API_KEY')
    print(f"1. os.environ['GEMINI_API_KEY']: {'SET' if env_key else 'NOT SET'}")
    if env_key:
        print(f"   Env Key Prefix: {env_key[:10]}...{env_key[-4:]}")
        
    # Check Django Settings
    django_key = getattr(settings, 'GEMINI_API_KEY', None)
    print(f"2. settings.GEMINI_API_KEY: {'SET' if django_key else 'NOT SET'}")
    if django_key:
        print(f"   Settings Key Prefix: {django_key[:10]}...{django_key[-4:]}")
        
    # Test Connectivity
    print("\n=== CONNECTIVITY TEST ===")
    try:
        client = genai.Client(api_key=django_key)
        # We'll just generate a tiny prompt
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents='Say the word "test".'
        )
        print("API Call: SUCCESS")
        print(f"Response: {response.text.strip()}")
    except APIError as e:
        print("API Call: FAILED with APIError")
        print(f"Exception: {str(e)}")
    except Exception as e:
        print("API Call: FAILED")
        print(f"Exception: {str(e)}")

if __name__ == '__main__':
    run_diagnostics()
