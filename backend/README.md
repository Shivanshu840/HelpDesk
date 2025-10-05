# HelpDesk Mini - Django Backend

## Setup Instructions

1. Create a virtual environment:
\`\`\`bash
python -m venv venv
source venv/bin/activate
\`\`\`

2. Install dependencies:
\`\`\`bash
pip install -r requirements.txt
\`\`\`

3. Run migrations:
\`\`\`bash
python manage.py makemigrations
python manage.py migrate
\`\`\`

4. Create a superuser:
\`\`\`bash
python manage.py createsuperuser
\`\`\`

5. Load initial SLA data:
\`\`\`bash
python manage.py shell
\`\`\`

Then run:
\`\`\`python
from tickets.models import SLA
SLA.objects.create(priority='low', response_time_hours=24, resolution_time_hours=72)
SLA.objects.create(priority='medium', response_time_hours=8, resolution_time_hours=48)
SLA.objects.create(priority='high', response_time_hours=4, resolution_time_hours=24)
SLA.objects.create(priority='critical', response_time_hours=1, resolution_time_hours=8)
\`\`\`

6. Run the development server:
\`\`\`bash
python manage.py runserver
\`\`\`

The API will be available at http://localhost:8000/api/

## API Endpoints

- GET/POST /api/tickets/ - List/Create tickets
- GET/PUT/PATCH/DELETE /api/tickets/{id}/ - Retrieve/Update/Delete ticket
- GET /api/tickets/stats/ - Get ticket statistics
- POST /api/tickets/{id}/add_comment/ - Add comment to ticket
- GET /api/tickets/{id}/comments/ - Get ticket comments
- GET/POST /api/comments/ - List/Create comments
- GET/POST /api/sla/ - List/Create SLA rules
