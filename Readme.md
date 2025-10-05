# HelpDesk Mini

A full-stack help desk ticketing system built with Django REST Framework (backend) and Next.js (frontend).

## 🚀 Features

- Create, update, and manage support tickets
- Priority-based ticket management (Low, Medium, High, Critical)
- SLA (Service Level Agreement) tracking
- Comment system for ticket discussions
- Real-time ticket statistics
- Responsive web interface

## 📋 Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn package manager
- PostgreSQL (optional, SQLite works for development)

## 🛠️ Tech Stack

**Backend:**
- Django 4.x
- Django REST Framework
- PostgreSQL/SQLite

**Frontend:**
- Next.js 14
- React 18
- Tailwind CSS
- Axios

---

## 🔧 Backend Setup

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Create and activate virtual environment

**On Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**On macOS/Linux:**
```bash
python -m venv venv
source venv/bin/activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure environment variables
Create a `.env` file in the `backend` directory:
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
DATABASE_URL=your-database-url-here
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### 5. Run migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Create a superuser
```bash
python manage.py createsuperuser
```

### 7. Load initial SLA data
```bash
python manage.py shell
```

Then run the following in the Python shell:
```python
from tickets.models import SLA
SLA.objects.create(priority='low', response_time_hours=24, resolution_time_hours=72)
SLA.objects.create(priority='medium', response_time_hours=8, resolution_time_hours=48)
SLA.objects.create(priority='high', response_time_hours=4, resolution_time_hours=24)
SLA.objects.create(priority='critical', response_time_hours=1, resolution_time_hours=8)
exit()
```

### 8. Run the development server
```bash
python manage.py runserver
```

The API will be available at **http://localhost:8000/api/**

---

## 💻 Frontend Setup

### 1. Navigate to frontend directory
```bash
cd my-app
```

### 2. Install dependencies
```bash
pnpm install
# or
yarn install
```

### 3. Configure environment variables
Create a `.env.local` file in the `my-app` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 4. Run the development server
```bash
pnpm run dev
# or
yarn dev
```

The application will be available at **http://localhost:3000**

---

## 📡 API Endpoints

### Tickets
- `GET /api/tickets/` - List all tickets
- `POST /api/tickets/` - Create a new ticket
- `GET /api/tickets/{id}/` - Retrieve a specific ticket
- `PUT /api/tickets/{id}/` - Update a ticket (full update)
- `PATCH /api/tickets/{id}/` - Partially update a ticket
- `DELETE /api/tickets/{id}/` - Delete a ticket
- `GET /api/tickets/stats/` - Get ticket statistics

### Comments
- `GET /api/comments/` - List all comments
- `POST /api/comments/` - Create a new comment
- `POST /api/tickets/{id}/add_comment/` - Add comment to a specific ticket
- `GET /api/tickets/{id}/comments/` - Get all comments for a ticket

### SLA Rules
- `GET /api/sla/` - List all SLA rules
- `POST /api/sla/` - Create a new SLA rule

---

## 🗂️ Project Structure

```
HelpDesk/
├── backend/                # Django backend
│   ├── tickets/           # Tickets app
│   ├── manage.py
│   ├── requirements.txt
│   └── .env              # Backend environment variables (create this)
│
├── my-app/               # Next.js frontend
│   ├── src/
│   │   ├── app/         # App router pages
│   │   └── components/  # React components
│   ├── package.json
│   └── .env.local       # Frontend environment variables (create this)
│
└── README.md            # This file
```

---

## 🚀 Quick Start (Both Services)

### Terminal 1 - Backend
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python manage.py runserver
```

### Terminal 2 - Frontend
```bash
cd my-app
pnpm run dev
```

Visit **http://localhost:3000** to use the application.

---

## 🔐 Security Notes

- Never commit `.env` files to version control
- Change the `SECRET_KEY` in production
- Set `DEBUG=False` in production
- Configure proper `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS` for production
- Use environment variables for all sensitive data

---

## 📝 Development

### Running Tests

**Backend:**
```bash
cd backend
python manage.py test
```

**Frontend:**
```bash
cd my-app
```

### Building for Production

**Backend:**
```bash
python manage.py collectstatic
gunicorn your_project.wsgi:application
```

**Frontend:**
```bash
pnpm run build
pnpm start
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👤 Author

Shivanshu840

---

## 🐛 Known Issues

- List any known issues here

## 🔮 Future Enhancements

- Email notifications for ticket updates
- File attachments for tickets
- Advanced search and filtering
- User roles and permissions
- Dashboard analytics
- Mobile app