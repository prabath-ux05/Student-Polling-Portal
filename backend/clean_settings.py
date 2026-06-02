import os
import re

file_path = r'c:\Documents\Desktop Files\EduResponse AI\backend\core\settings.py'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove old apps
content = re.sub(r"\s*'apps\.polls',\s*", "\n", content)
content = re.sub(r"\s*'apps\.analytics',\s*", "\n", content)
content = re.sub(r"\s*'apps\.exports',\s*", "\n", content)
content = re.sub(r"\s*'apps\.audit',\s*", "\n", content)
content = re.sub(r"\s*'apps\.interviews',\s*", "\n    'apps.academics',\n", content)

# Remove audit middleware
content = re.sub(r"\s*'apps\.audit\.middleware\.AuditLogMiddleware',", "", content)

# Remove Gemini settings
content = re.sub(r"GEMINI_API_KEY = .*", "", content)
content = re.sub(r"GEMINI_PRIMARY_MODEL = .*", "", content)
content = re.sub(r"GEMINI_FALLBACK_MODEL = .*", "", content)

# Cleanup extra newlines
content = re.sub(r'\n{3,}', '\n\n', content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
