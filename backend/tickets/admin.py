from django.contrib import admin
from .models import Ticket, Comment, SLA

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'status', 'priority', 'customer_email', 'assigned_to', 'created_at', 'is_sla_breached']
    list_filter = ['status', 'priority', 'created_at']
    search_fields = ['title', 'description', 'customer_email']
    readonly_fields = ['created_at', 'updated_at', 'resolved_at', 'sla_breach_at', 'first_response_at']

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['id', 'ticket', 'author', 'is_internal', 'created_at']
    list_filter = ['is_internal', 'created_at']
    search_fields = ['content', 'author']

@admin.register(SLA)
class SLAAdmin(admin.ModelAdmin):
    list_display = ['priority', 'response_time_hours', 'resolution_time_hours']
    list_filter = ['priority']
