from django.shortcuts import render, redirect
from .models import Client, Domain
from rest_framework_simplejwt.tokens import RefreshToken
from .url_links import *



def get_port_part():
    if not BASE_PORT:
        return ""

    return ":" + str(BASE_PORT).lstrip(":")

def signup(request):

    if request.method == "POST":

        username = request.POST.get("username").strip().lower()
        password = request.POST.get("password")

        if Client.objects.filter(username=username).exists():
            return render(
                request,
                "signup/signup.html",
                {
                    "error": "Username already exists"
                }
            )

        tenant = Client(
            username=username,
            password=password,
            slug=username,
            schema_name=username
        )

        tenant.save()

        domain = Domain(
            domain=f"{username}.{BASE_URL}",
            tenant=tenant,
            is_primary=True
        )

        domain.save()
        port_part = get_port_part()

        redirect_url = (
    f"{BASE_SCHEME}://{tenant.slug}.{BASE_URL}"
    f"{port_part}/step2/{tenant.id}/"
)

        print("SIGNUP REDIRECT =", repr(redirect_url))

        return redirect(redirect_url)
        

    return render(request, "signup/signup.html")




def login_view(request):

    if request.method == "POST":

        username = request.POST.get(
            "username",
            ""
        ).strip().lower()

        password = request.POST.get(
            "password",
            ""
        )

        try:

            client = Client.objects.get(
                username=username,
                password=password
            )

            refresh = RefreshToken()
            refresh["client_id"] = client.id
            refresh["username"] = client.username
            refresh["tenant_schema"] = client.schema_name

            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            port_part = get_port_part()

            return redirect(
                f"{BASE_SCHEME}://{client.slug}.{BASE_URL}"
                f"{port_part}/dashboard/"
                f"?access={access_token}&refresh={refresh_token}"
            )

        except Client.DoesNotExist:

            return render(
                request,
                "login/login.html",
                {
                    "error": "Invalid username or password"
                }
            )

    return render(
        request,
        "login/login.html"
    )


