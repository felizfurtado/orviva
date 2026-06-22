from django.shortcuts import render, redirect
from .models import Client, Domain
from rest_framework_simplejwt.tokens import RefreshToken
from django.views.decorators.csrf import csrf_exempt
from django.core.management import call_command


@csrf_exempt
def signup(request):
    if request.method == "POST":
        username = request.POST.get("username").strip().lower()
        password = request.POST.get("password")

        if Client.objects.filter(username=username).exists():
            return render(request, "signup/signup.html", {"error": "Username already exists"})

        tenant = Client(
            username=username,
            password=password,
            slug=username,
            schema_name=username
        )
        tenant.save()

        # Auto-migrate tenant schema
        call_command('migrate_schemas', schema_name=username, interactive=False)

        domain = Domain(
            domain=f"{username}.localhost",
            tenant=tenant,
            is_primary=True
        )
        domain.save()

        refresh = RefreshToken.for_user(tenant)
        
        return redirect(f"/step2/{tenant.id}/?access={str(refresh.access_token)}&refresh={str(refresh)}")

    return render(request, "signup/signup.html")



@csrf_exempt
def login_view(request):
    if request.method == "POST":
        username = request.POST.get("username", "").strip().lower()
        password = request.POST.get("password", "")

        try:
            client = Client.objects.get(username=username, password=password)
            
            refresh = RefreshToken.for_user(client)
            
            return redirect(f"/dashboard/?access={str(refresh.access_token)}&refresh={str(refresh)}")

        except Client.DoesNotExist:
            return render(request, "login/login.html", {"error": "Invalid username or password"})

    return render(request, "login/login.html")