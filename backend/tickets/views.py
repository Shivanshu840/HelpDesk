from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.contrib.auth import get_user_model
from .models import Ticket, Comment, SLA
from .serializers import TicketSerializer, TicketListSerializer, CommentSerializer, SLASerializer
from .permissions import TicketPermission, IsAdminUser, IsAgentOrAdmin

User = get_user_model()

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    permission_classes = [TicketPermission]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return TicketListSerializer
        return TicketSerializer
    
    def get_queryset(self):
        """Filter tickets based on user role"""
        user = self.request.user
        
        # Admin sees all tickets
        if user.role == 'admin':
            return Ticket.objects.all().order_by('-created_at')
        
        # Agent sees all tickets
        if user.role == 'agent':
            return Ticket.objects.all().order_by('-created_at')
        
        # Customer sees only their own tickets
        if user.role == 'customer':
            return Ticket.objects.filter(customer_email=user.email).order_by('-created_at')
        
        return Ticket.objects.none()
    
    def perform_create(self, serializer):
        """Set customer email from authenticated user if customer"""
        if self.request.user.role == 'customer':
            serializer.save(customer_email=self.request.user.email)
        else:
            serializer.save()
    
    @action(detail=True, methods=['post'])
    def add_comment(self, request, pk=None):
        ticket = self.get_object()
        serializer = CommentSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(ticket=ticket)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'], permission_classes=[IsAgentOrAdmin])
    def comments(self, request, pk=None):
        """Only agents and admins can view comments"""
        ticket = self.get_object()
        comments = ticket.comments.all()
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get ticket stats filtered by user role"""
        user = request.user
        
        # Get base queryset based on role
        if user.role in ['admin', 'agent']:
            queryset = Ticket.objects.all()
        else:  # customer
            queryset = Ticket.objects.filter(customer_email=user.email)
        
        total = queryset.count()
        open_tickets = queryset.filter(status='open').count()
        in_progress = queryset.filter(status='in_progress').count()
        resolved = queryset.filter(status='resolved').count()
        breached = queryset.filter(
            sla_breach_at__lt=timezone.now(),
            status__in=['open', 'in_progress']
        ).count()
        
        return Response({
            'total': total,
            'open': open_tickets,
            'in_progress': in_progress,
            'resolved': resolved,
            'sla_breached': breached
        })


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAgentOrAdmin]


class SLAViewSet(viewsets.ModelViewSet):
    queryset = SLA.objects.all()
    serializer_class = SLASerializer
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        """Only admin can create/update/delete SLA rules"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticated()]


@api_view(['GET'])
@permission_classes([IsAgentOrAdmin])
def get_assignable_users(request):
    """Get list of users that can be assigned to tickets (agents and admins)"""
    users = User.objects.filter(role__in=['agent', 'admin']).values(
        'id', 'username', 'first_name', 'last_name', 'email'
    )
    
    user_list = [
        {
            'id': user['id'],
            'name': f"{user['first_name']} {user['last_name']}".strip() or user['username'],
            'username': user['username'],
            'email': user['email']
        }
        for user in users
    ]
    
    return Response(user_list)