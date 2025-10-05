from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model
from datetime import timedelta

User = get_user_model()

class SLA(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, unique=True)
    response_time_hours = models.IntegerField()
    resolution_time_hours = models.IntegerField()
    
    class Meta:
        verbose_name = 'SLA'
        verbose_name_plural = 'SLAs'
    
    def __str__(self):
        return f"{self.priority.upper()} - Response: {self.response_time_hours}h, Resolution: {self.resolution_time_hours}h"


class Ticket(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    customer_email = models.EmailField()
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_tickets')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_tickets')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(blank=True, null=True)
    sla_breach_at = models.DateTimeField(blank=True, null=True)
    first_response_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"#{self.id} - {self.title}"
    
    def save(self, *args, **kwargs):
        if not self.pk:
            try:
                sla = SLA.objects.get(priority=self.priority)
                self.sla_breach_at = timezone.now() + timedelta(hours=sla.resolution_time_hours)
            except SLA.DoesNotExist:
                pass
        
        if self.status == 'resolved' and not self.resolved_at:
            self.resolved_at = timezone.now()
        
        super().save(*args, **kwargs)
    
    @property
    def is_sla_breached(self):
        if self.sla_breach_at and self.status not in ['resolved', 'closed']:
            return timezone.now() > self.sla_breach_at
        return False
    
    @property
    def time_to_resolution(self):
        if self.resolved_at:
            return (self.resolved_at - self.created_at).total_seconds() / 3600
        return None


class Comment(models.Model):
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    author_name = models.CharField(max_length=255)
    content = models.TextField()
    is_internal = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"Comment by {self.author_name} on Ticket #{self.ticket.id}"
    
    def save(self, *args, **kwargs):
        is_new = not self.pk
        super().save(*args, **kwargs)
        
        if is_new and not self.ticket.first_response_at:
            self.ticket.first_response_at = timezone.now()
            self.ticket.save()
