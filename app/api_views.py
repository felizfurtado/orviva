from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view
from rest_framework.response import Response
from app.models import Client

class LoginView(TokenObtainPairView):
    pass  # Uses default behavior

@api_view(['POST'])
def signup_api(request):
    username = request.data.get('username', '').strip().lower()
    password = request.data.get('password')

    if Client.objects.filter(username=username).exists():
        return Response({'error': 'Username exists'}, status=400)

    client = Client.objects.create(
        username=username,
        password=password,
        slug=username,
        schema_name=username
    )

    refresh = RefreshToken.for_user(client)
    
    return Response({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'tenant': client.slug
    })