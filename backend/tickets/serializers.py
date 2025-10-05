from rest_framework import serializers
from .models import Ticket, Comment, SLA
from django.contrib.auth import get_user_model

User = get_user_model()

class SLASerializer(serializers.ModelSerializer):
    class Meta:
        model = SLA
        fields = ['id', 'priority', 'response_time_hours', 'resolution_time_hours']


class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(required=False)
    
    class Meta:
        model = Comment
        fields = ['id', 'ticket', 'author', 'author_name', 'content', 'is_internal', 'created_at']
        read_only_fields = ['created_at', 'author', 'ticket']
    
    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['author'] = request.user
            # Use provided author_name or fallback to user's name
            if 'author_name' not in validated_data or not validated_data['author_name']:
                validated_data['author_name'] = request.user.get_full_name() or request.user.username
        return super().create(validated_data)


class TicketSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    is_sla_breached = serializers.BooleanField(read_only=True)
    time_to_resolution = serializers.FloatField(read_only=True)
    assigned_to_name = serializers.SerializerMethodField()
    assigned_to = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        required=False,
        allow_null=True
    )
    
    class Meta:
        model = Ticket
        fields = [
            'id', 'title', 'description', 'status', 'priority',
            'customer_email', 'assigned_to', 'assigned_to_name', 'created_at', 'updated_at',
            'resolved_at', 'sla_breach_at', 'first_response_at',
            'comments', 'is_sla_breached', 'time_to_resolution'
        ]
        read_only_fields = ['created_at', 'updated_at', 'resolved_at', 'sla_breach_at', 'first_response_at']
    
    def get_assigned_to_name(self, obj):
        if obj.assigned_to:
            return obj.assigned_to.get_full_name() or obj.assigned_to.username
        return None
    
    def to_representation(self, instance):
        """Override to return assigned_to as string for compatibility"""
        ret = super().to_representation(instance)
        if instance.assigned_to:
            ret['assigned_to'] = instance.assigned_to.get_full_name() or instance.assigned_to.username
        return ret


class TicketListSerializer(serializers.ModelSerializer):
    is_sla_breached = serializers.BooleanField(read_only=True)
    comment_count = serializers.SerializerMethodField()
    assigned_to_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Ticket
        fields = [
            'id', 'title', 'status', 'priority', 'customer_email',
            'assigned_to', 'assigned_to_name', 'created_at', 'updated_at', 'sla_breach_at',
            'is_sla_breached', 'comment_count'
        ]
    
    def get_comment_count(self, obj):
        return obj.comments.count()
    
    def get_assigned_to_name(self, obj):
        if obj.assigned_to:
            return obj.assigned_to.get_full_name() or obj.assigned_to.username
        return None
    
    def to_representation(self, instance):
        """Override to return assigned_to as string for compatibility"""
        ret = super().to_representation(instance)
        if instance.assigned_to:
            ret['assigned_to'] = instance.assigned_to.get_full_name() or instance.assigned_to.username
        return ret