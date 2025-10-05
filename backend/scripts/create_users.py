import os
import sys
import django

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'helpdesk.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def create_users():
    print("Creating users...")
    
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser(
            username='admin',
            email='admin@helpdesk.com',
            password='admin123',
            first_name='Admin',
            last_name='User',
            role='admin'
        )
        print("Created admin user (username: admin, password: admin123)")
    
    if not User.objects.filter(username='agent1').exists():
        User.objects.create_user(
            username='agent1',
            email='agent1@helpdesk.com',
            password='agent123',
            first_name='John',
            last_name='Agent',
            role='agent'
        )
        print("Created agent user (username: agent1, password: agent123)")
    
    if not User.objects.filter(username='customer1').exists():
        User.objects.create_user(
            username='customer1',
            email='customer1@example.com',
            password='customer123',
            first_name='Jane',
            last_name='Customer',
            role='customer'
        )
        print("Created customer user (username: customer1, password: customer123)")
    
    print("Users created successfully!")

if __name__ == '__main__':
    create_users()
