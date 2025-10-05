import os
import sys
import django

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'helpdesk.settings')
django.setup()

from tickets.models import Ticket, Comment, SLA
from django.utils import timezone
from datetime import timedelta

def seed_sla():
    print("Creating SLA rules...")
    SLA.objects.all().delete()
    
    SLA.objects.create(priority='low', response_time_hours=24, resolution_time_hours=72)
    SLA.objects.create(priority='medium', response_time_hours=8, resolution_time_hours=48)
    SLA.objects.create(priority='high', response_time_hours=4, resolution_time_hours=24)
    SLA.objects.create(priority='critical', response_time_hours=1, resolution_time_hours=8)
    
    print("SLA rules created successfully!")

def seed_tickets():
    print("Creating sample tickets...")
    
    tickets_data = [
        {
            'title': 'Cannot login to account',
            'description': 'I am unable to login to my account. Getting error message "Invalid credentials"',
            'priority': 'high',
            'status': 'open',
            'customer_email': 'john.doe@example.com',
        },
        {
            'title': 'Feature request: Dark mode',
            'description': 'Would love to see a dark mode option in the application',
            'priority': 'low',
            'status': 'open',
            'customer_email': 'jane.smith@example.com',
        },
        {
            'title': 'Payment processing failed',
            'description': 'Payment failed multiple times with different cards',
            'priority': 'critical',
            'status': 'in_progress',
            'customer_email': 'bob.wilson@example.com',
            'assigned_to': 'Support Team',
        },
        {
            'title': 'Slow page load times',
            'description': 'Dashboard takes more than 10 seconds to load',
            'priority': 'medium',
            'status': 'in_progress',
            'customer_email': 'alice.brown@example.com',
            'assigned_to': 'Tech Team',
        },
        {
            'title': 'Email notifications not working',
            'description': 'Not receiving any email notifications for updates',
            'priority': 'medium',
            'status': 'resolved',
            'customer_email': 'charlie.davis@example.com',
            'assigned_to': 'Support Team',
        },
    ]
    
    for ticket_data in tickets_data:
        ticket = Ticket.objects.create(**ticket_data)
        print(f"Created ticket: {ticket.title}")

def seed_comments():
    print("Creating sample comments...")
    
    tickets = Ticket.objects.all()
    
    if tickets.exists():
        ticket1 = tickets[0]
        Comment.objects.create(
            ticket=ticket1,
            author='Support Agent',
            content='Thank you for reporting this issue. We are investigating the login problem.',
            is_internal=False
        )
        Comment.objects.create(
            ticket=ticket1,
            author='Tech Team',
            content='Found the issue in authentication service. Deploying fix.',
            is_internal=True
        )
        
        if tickets.count() > 2:
            ticket3 = tickets[2]
            Comment.objects.create(
                ticket=ticket3,
                author='Support Agent',
                content='We have escalated this to our payment team. They are working on it urgently.',
                is_internal=False
            )
    
    print("Sample comments created successfully!")

if __name__ == '__main__':
    print("Starting database seeding...")
    seed_sla()
    seed_tickets()
    seed_comments()
    print("Database seeding completed!")
