import os
from django.core.wsgi import get_wsgi_application
from django.core.management import call_command

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'finance_api.settings')

application = get_wsgi_application()

# Automatizar migrações no início (útil no Vercel)
try:
    print("Iniciando migrações automáticas via WSGI...")
    call_command('migrate', interactive=False)
except Exception as e:
    print(f"Erro na migração automática: {e}")

app = application
