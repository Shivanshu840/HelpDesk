import requests

# Test ticket creation without auth
url = "http://localhost:8000/api/tickets/"
data = {
    "title": "Test Ticket",
    "description": "This is a test ticket",
    "priority": "medium",
    "customer_email": "test@example.com"
}

response = requests.post(url, json=data)
print(f"Status: {response.status_code}")
print(f"Response: {response.json()}")
