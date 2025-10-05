from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([AllowAny])
def debug_headers(request):
    """Return all headers to debug authentication"""
    headers = {k: v for k, v in request.META.items() if k.startswith('HTTP_') or k in ['CONTENT_TYPE', 'CONTENT_LENGTH']}
    
    return Response({
        'headers': headers,
        'auth_header': request.META.get('HTTP_AUTHORIZATION', 'NOT FOUND'),
        'user': str(request.user),
        'is_authenticated': request.user.is_authenticated,
    })
