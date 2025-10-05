from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    """Only admin users can access"""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'admin'

class IsAgentOrAdmin(permissions.BasePermission):
    """Agents and admins can access"""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role in ['agent', 'admin']

class IsCustomerOwnerOrStaff(permissions.BasePermission):
    """
    - Customers can only access their own tickets
    - Agents and admins can access all tickets
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        # Admin and agents can access any ticket
        if request.user.role in ['admin', 'agent']:
            return True
        
        # Customers can only access their own tickets
        if request.user.role == 'customer':
            return obj.customer_email == request.user.email
        
        return False

class TicketPermission(permissions.BasePermission):
    """
    - Customers: Can create and view their own tickets
    - Agents: Can view and update all tickets
    - Admins: Full access
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Allow list and create for all authenticated users
        if view.action in ['list', 'create', 'stats']:
            return True
        
        # Retrieve, update, delete require object permission
        return True
    
    def has_object_permission(self, request, view, obj):
        # Admin has full access
        if request.user.role == 'admin':
            return True
        
        # Agent can view and update
        if request.user.role == 'agent':
            if view.action in ['retrieve', 'update', 'partial_update', 'add_comment']:
                return True
            return False
        
        # Customer can only view their own tickets
        if request.user.role == 'customer':
            if view.action == 'retrieve':
                return obj.customer_email == request.user.email
            return False
        
        return False
