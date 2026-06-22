from django.shortcuts import render, redirect
from .models import Client, Domain
from .url_links import BASE_URL


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
            domain=f"{username}.localhost",
            tenant=tenant,
            is_primary=True
        )

        domain.save()

        return redirect(f"http://{tenant.slug}.{BASE_URL}/step2/{tenant.id}/")

    return render(request, "signup/signup.html")






from django.shortcuts import render, redirect
from app.models import Client
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

            return redirect(
                f"http://{client.slug}.{BASE_URL}/dashboard/"
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


