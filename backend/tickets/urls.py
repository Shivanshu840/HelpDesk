from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TicketViewSet, CommentViewSet, SLAViewSet, get_assignable_users
from .debug_views import debug_headers

router = DefaultRouter()
router.register(r'tickets', TicketViewSet, basename='ticket')
router.register(r'comments', CommentViewSet, basename='comment')
router.register(r'sla', SLAViewSet, basename='sla')

urlpatterns = [
    path('', include(router.urls)),
    path('debug/headers/', debug_headers, name='debug-headers'),
    path('users/assignable/', get_assignable_users, name='assignable-users'),
]