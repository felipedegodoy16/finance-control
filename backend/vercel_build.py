import os
import django
from django.core.management import call_command

def build():
    # Define settings module
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'finance_api.settings')
    
    # Initialize Django
    django.setup()

    print("--- Início do Build Automático ---")
    
    try:
        # Run migrations
        print("Rodando migrações do banco de dados...")
        call_command('migrate', interactive=False)
        
        # Collect static files
        print("Coletando arquivos estáticos...")
        call_command('collectstatic', interactive=False)
        
        print("--- Build concluído com sucesso! ---")
    except Exception as e:
        print(f"Erro durante o build: {e}")
        raise e

if __name__ == "__main__":
    build()
