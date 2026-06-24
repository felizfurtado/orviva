from django.http import HttpResponse

from django.shortcuts import render, redirect, get_object_or_404
from app.models import Client
from .models import *
import os
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from pathlib import Path
from PIL import Image


from django.http import JsonResponse
from functools import wraps
import jwt

from app.url_links import *


def tenant_test(request):

    settings = ClientSettings.objects.first()
    categories = Category.objects.all()

    html = f"""
    <h1>Tenant Information</h1>

    <p><b>Tenant:</b> {request.tenant}</p>
    <p><b>Schema:</b> {request.tenant.schema_name}</p>
    <p><b>Domain:</b> {request.get_host()}</p>

    <hr>

    <h2>Theme</h2>
    <p>{settings.theme if settings else ''}</p>

    <h2>Store Settings</h2>

    <p><b>Logo:</b> {settings.logo_link if settings else ''}</p>
    <p><b>Heading:</b> {settings.heading if settings else ''}</p>
    <p><b>Tagline:</b> {settings.tagline if settings else ''}</p>
    <p><b>Search Tagline:</b> {settings.search_bar_tagline if settings else ''}</p>
    <p><b>WhatsApp:</b> {settings.whatsapp_number if settings else ''}</p>

    <p><b>Note:</b> {settings.note if settings else ''}</p>
    <p><b>Sub Note:</b> {settings.sub_note if settings else ''}</p>
    <p><b>Other Note:</b> {settings.other_note if settings else ''}</p>
    <p><b>Other Sub Note:</b> {settings.other_subnote if settings else ''}</p>

    <hr>

    <h2>Categories</h2>
    """

    for category in categories:
        html += f"<p>• {category.name}</p>"

    return HttpResponse(html)




from functools import wraps
import jwt
from django.conf import settings
from django.shortcuts import redirect
from rest_framework_simplejwt.tokens import RefreshToken



def jwt_required(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        token = request.GET.get("access") or request.session.get("access_token")

        # Local: :8000
        # VPS: empty
        port_part = f":{BASE_PORT}" if BASE_PORT else ""

        if not token:
            return redirect(
                f"{BASE_SCHEME}://{BASE_URL}{port_part}/login/"
            )

        try:
            payload = jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=["HS256"]
            )
            request.jwt_user = payload

        except jwt.ExpiredSignatureError:
            refresh = (
                request.GET.get("refresh")
                or request.session.get("refresh_token")
            )

            if refresh:
                try:
                    refresh_token = RefreshToken(refresh)
                    new_access = str(refresh_token.access_token)

                    request.session["access_token"] = new_access

                    payload = jwt.decode(
                        new_access,
                        settings.SECRET_KEY,
                        algorithms=["HS256"]
                    )
                    request.jwt_user = payload

                except Exception:
                    request.session.flush()
                    return redirect(
                        f"{BASE_SCHEME}://{BASE_URL}{port_part}/login/"
                    )

            else:
                request.session.flush()
                return redirect(
                    f"{BASE_SCHEME}://{BASE_URL}{port_part}/login/"
                )

        except jwt.InvalidTokenError:
            request.session.flush()
            return redirect(
                f"{BASE_SCHEME}://{BASE_URL}{port_part}/login/"
            )

        return view_func(request, *args, **kwargs)

    return wrapper


def step2(request, client_id):

    client = get_object_or_404(
        Client,
        id=client_id
    )

    if request.method == "POST":

        theme = request.POST.get("theme")

        ClientSettings.objects.update_or_create(
            client=client,
            defaults={
                "theme": theme
            }
        )

        return redirect(f"/step3/{client.id}/")

    return render(
        request,
        "signup/step2.html",
        {
            "client": client
        }
    )



def step3(request, client_id):
    client = get_object_or_404(
        Client,
        id=client_id
    )

    settings, created = ClientSettings.objects.get_or_create(
        client=client
    )

    if request.method == "POST":
        settings.heading = request.POST.get("heading")
        settings.tagline = request.POST.get("tagline")
        settings.search_bar_tagline = request.POST.get("search_bar_tagline")
        settings.whatsapp_number = request.POST.get("whatsapp_number")
        settings.note = request.POST.get("note")
        settings.sub_note = request.POST.get("sub_note")
        settings.other_note = request.POST.get("other_note")
        settings.other_subnote = request.POST.get("other_subnote")

        logo_file = request.FILES.get("logo")

        if logo_file:
            tenant = request.tenant.schema_name

            logo_folder = (
                Path("tenants")
                / tenant
                / "logo"
            )

            logo_folder.mkdir(
                parents=True,
                exist_ok=True
            )

            logo_filename = "logo.jpg"
            logo_path = logo_folder / logo_filename

            try:
                img = Image.open(logo_file)

                # JPEG cannot keep transparency, so make transparent logos white.
                if img.mode in ("RGBA", "LA", "P"):
                    background = Image.new("RGB", img.size, "white")

                    if img.mode == "P":
                        img = img.convert("RGBA")

                    if img.mode == "RGBA":
                        background.paste(img, mask=img.getchannel("A"))
                    else:
                        background.paste(img)

                    img = background
                else:
                    img = img.convert("RGB")

                # Logos should stay reasonably small but sharp.
                max_size = 700

                if img.width > max_size or img.height > max_size:
                    img.thumbnail(
                        (max_size, max_size),
                        Image.Resampling.LANCZOS
                    )

                img.save(
                    logo_path,
                    "JPEG",
                    quality=65,
                    optimize=True,
                    progressive=True
                )

                settings.logo_link = (
                    f"tenants/{tenant}/logo/{logo_filename}"
                )

                print(f"Logo saved: {logo_path.resolve()}")
                print(
                    f"Logo size: "
                    f"{logo_path.stat().st_size / 1024:.2f} KB"
                )

            except Exception as e:
                print(f"Logo processing error: {e}")

        settings.save()

        return redirect(f"/step4/{client.id}/")

    return render(
        request,
        "signup/step3.html",
        {
            "client": client,
            "settings": settings
        }
    )



def step4(request, client_id):

    client = get_object_or_404(
        Client,
        id=client_id
    )

    if request.method == "POST":

        categories = request.POST.get(
            "categories",
            ""
        )

        for category_name in categories.splitlines():

            category_name = category_name.strip()

            if category_name:

                Category.objects.get_or_create(
                    name=category_name
                )

        return redirect("/")

    return render(
        request,
        "signup/step4.html",
        {
            "client": client
        }
    )


@jwt_required
def dashboard(request):
    # Save tokens from URL to session for future requests
    if request.GET.get('access'):
        request.session['access_token'] = request.GET.get('access')
    if request.GET.get('refresh'):
        request.session['refresh_token'] = request.GET.get('refresh')

    settings = ClientSettings.objects.first()
    context = {
        "settings": settings,
        "category_count": Category.objects.count(),
        "product_count": Product.objects.count(),
    }
    return render(request, "index.html", context)




from django.shortcuts import render
from .models import ClientSettings, Category, Product

@jwt_required
def products(request):

    products = Product.objects.select_related(
        "category"
    ).all()

    return render(
        request,
        "products.html",
        {
            "products": products
        }
    )

@jwt_required
def categories(request):

    categories = Category.objects.all()

    return render(
        request,
        "categories.html",
        {
            "categories": categories
        }
    )

@jwt_required
def profile(request):

    settings = ClientSettings.objects.first()

    if request.method == "POST":

        settings.logo_link = request.POST.get("logo_link")
        settings.heading = request.POST.get("heading")
        settings.tagline = request.POST.get("tagline")
        settings.search_bar_tagline = request.POST.get("search_bar_tagline")
        settings.whatsapp_number = request.POST.get("whatsapp_number")
        settings.note = request.POST.get("note")
        settings.sub_note = request.POST.get("sub_note")
        settings.other_note = request.POST.get("other_note")
        settings.other_subnote = request.POST.get("other_subnote")

        settings.save()

        return redirect("/profile/")

    return render(
        request,
        "profile.html",
        {
            "settings": settings
        }
    )



from django.utils.text import slugify
from PIL import Image
import io

from django.utils.text import slugify


@jwt_required
def add_product(request):
    categories = Category.objects.all()

    if request.method == "POST":
        print("\n====================")
        print("ADD PRODUCT STARTED")
        print("====================")

        print("POST DATA:")
        print(request.POST)

        print("\nFILES:")
        print(request.FILES)

        category = Category.objects.get(
            id=request.POST.get("category")
        )

        # Handle options (sizes & prices) from form
        option_names = request.POST.getlist('option_name[]')
        option_prices = request.POST.getlist('option_price[]')
        
        options_dict = {}
        for name, price in zip(option_names, option_prices):
            if name.strip() and price.strip():
                options_dict[name.strip()] = price.strip()
        
        print(f"\nOptions parsed: {options_dict}")

        # Handle add-ons from form
        addon_names = request.POST.getlist('addon_name[]')
        addon_prices = request.POST.getlist('addon_price[]')
        
        addon_dict = {}
        for name, price in zip(addon_names, addon_prices):
            if name.strip() and price.strip():
                addon_dict[name.strip()] = price.strip()
        
        print(f"\nAdd-ons parsed: {addon_dict}")

        product = Product.objects.create(
            category=category,
            heading=request.POST.get("heading"),
            tagline=request.POST.get("tagline"),
            description=request.POST.get("description"),
            ingredients=request.POST.get("ingredients"),
            options=options_dict,
            add_on_options=addon_dict,
            slug=slugify(request.POST.get("heading"))
        )

        print(f"\nProduct Created")
        print(f"ID: {product.id}")
        print(f"Name: {product.heading}")

        tenant = request.tenant.schema_name

        print(f"\nTenant: {tenant}")

        product_folder = (
            Path("tenants")
            / tenant
            / "products"
            / str(product.id)
        )

        print("\nFolder Path:")
        print(product_folder.resolve())

        product_folder.mkdir(
            parents=True,
            exist_ok=True
        )

        print("Folder Created Successfully")

        image1_path = None
        image2_path = None
        image3_path = None

        def process_and_save_image(image_file, filename, quality=60):
            """Process image: resize if needed, compress, and save"""
            if not image_file:
                return None
            
            try:
                print(f"\nProcessing {filename}: {image_file.name}")
                
                img = Image.open(image_file)
                
                if img.mode in ('RGBA', 'LA', 'P'):
                    img = img.convert('RGB')
                
                max_size = 1200
                if img.width > max_size or img.height > max_size:
                    img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
                    print(f"  Resized to {img.width}x{img.height}")
                
                output_path = product_folder / filename
                
                img.save(
                    output_path,
                    'JPEG',
                    quality=quality,
                    optimize=True,
                    progressive=True
                )
                
                print(f"  Saved {filename} with quality {quality}")
                print(f"  Final size: {output_path.stat().st_size / 1024:.2f} KB")
                
                return f"tenants/{tenant}/products/{product.id}/{filename}"
                
            except Exception as e:
                print(f"  Error processing {filename}: {e}")
                with open(product_folder / filename, "wb+") as destination:
                    for chunk in image_file.chunks():
                        destination.write(chunk)
                return f"tenants/{tenant}/products/{product.id}/{filename}"

        image1_path = process_and_save_image(
            request.FILES.get("image1"), 
            "image1.jpg", 
            quality=60
        )
        
        image2_path = process_and_save_image(
            request.FILES.get("image2"), 
            "image2.jpg", 
            quality=60
        )
        
        image3_path = process_and_save_image(
            request.FILES.get("image3"), 
            "image3.jpg", 
            quality=60
        )

        product.image1 = image1_path
        product.image2 = image2_path
        product.image3 = image3_path

        product.save()

        print("\nDB PATHS SAVED:")
        print(product.image1)
        print(product.image2)
        print(product.image3)

        print("\nFINAL FOLDER CONTENTS:")

        for file in product_folder.iterdir():
            size_kb = file.stat().st_size / 1024
            print(f"{file.name} - {size_kb:.2f} KB")

        print("\nADD PRODUCT COMPLETED")
        print("====================\n")

        return redirect("/products/")

    return render(
        request,
        "add_product.html",
        {
            "categories": categories
        }
    )


@jwt_required
def add_category(request):

    if request.method == "POST":

        name = request.POST.get("name")

        if name:
            Category.objects.create(
                name=name.strip()
            )

        return redirect("/categories/")

    return render(
        request, 
        "add_category.html"
    )


@jwt_required
def edit_category(request, category_id):
    category = get_object_or_404(Category, id=category_id)

    if request.method == "POST":
        name = request.POST.get("name")
        if name:
            category.name = name.strip()
            category.save()
        return redirect("/categories/")

    # For GET, redirect back to categories
    return redirect("/categories/")




@jwt_required
def delete_category(request, category_id):
    category = get_object_or_404(Category, id=category_id)
    
    if request.method == "POST":
        category.delete()
    
    return redirect("/categories/")


from pathlib import Path
@jwt_required
def edit_product(request, product_id):
    product = get_object_or_404(
        Product,
        id=product_id
    )

    categories = Category.objects.all()

    tenant = request.tenant.schema_name

    product_folder = (
        Path("tenants")
        / tenant
        / "products"
        / str(product.id)
    )

    product_folder.mkdir(
        parents=True,
        exist_ok=True
    )

    if request.method == "POST":
        product.category = Category.objects.get(
            id=request.POST.get("category")
        )

        product.heading = request.POST.get("heading")
        product.tagline = request.POST.get("tagline")
        product.description = request.POST.get("description")
        product.ingredients = request.POST.get("ingredients")
        product.slug = slugify(request.POST.get("heading"))

        # Handle options (sizes & prices)
        option_names = request.POST.getlist('option_name[]')
        option_prices = request.POST.getlist('option_price[]')
        
        options_dict = {}
        for name, price in zip(option_names, option_prices):
            if name.strip() and price.strip():
                options_dict[name.strip()] = price.strip()
        
        product.options = options_dict
        print(f"\nOptions updated: {options_dict}")

        # Handle add-ons
        addon_names = request.POST.getlist('addon_name[]')
        addon_prices = request.POST.getlist('addon_price[]')
        
        addon_dict = {}
        for name, price in zip(addon_names, addon_prices):
            if name.strip() and price.strip():
                addon_dict[name.strip()] = price.strip()
        
        product.add_on_options = addon_dict
        print(f"Add-ons updated: {addon_dict}")

        def process_and_save_image(image_file, filename, quality=60):
            """Process image: compress and save"""
            if not image_file:
                return None
            
            try:
                print(f"\nProcessing {filename}: {image_file.name}")
                
                original_size = image_file.size
                print(f"  Original size: {original_size / 1024:.2f} KB")
                
                img = Image.open(image_file)
                
                if img.mode in ('RGBA', 'LA', 'P'):
                    img = img.convert('RGB')
                
                max_size = 1200
                if img.width > max_size or img.height > max_size:
                    img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
                    print(f"  Resized to {img.width}x{img.height}")
                
                output_path = product_folder / filename
                img.save(
                    output_path,
                    'JPEG',
                    quality=quality,
                    optimize=True,
                    progressive=True
                )
                
                final_size = output_path.stat().st_size / 1024
                compression_ratio = (1 - final_size / (original_size / 1024)) * 100
                
                print(f"  ✅ Saved {filename}")
                print(f"  Compressed: {final_size:.2f} KB")
                print(f"  Compression: {compression_ratio:.1f}% reduction")
                
                return f"tenants/{tenant}/products/{product.id}/{filename}"
                
            except Exception as e:
                print(f"  ❌ Error processing {filename}: {e}")
                with open(product_folder / filename, "wb+") as destination:
                    for chunk in image_file.chunks():
                        destination.write(chunk)
                return f"tenants/{tenant}/products/{product.id}/{filename}"

        if request.FILES.get("image1"):
            product.image1 = process_and_save_image(
                request.FILES["image1"], 
                "image1.jpg", 
                quality=60
            )

        if request.FILES.get("image2"):
            product.image2 = process_and_save_image(
                request.FILES["image2"], 
                "image2.jpg", 
                quality=60
            )

        if request.FILES.get("image3"):
            product.image3 = process_and_save_image(
                request.FILES["image3"], 
                "image3.jpg", 
                quality=60
            )

        product.save()
        
        print("\n✅ Product updated successfully!")
        print(f"   ID: {product.id}")
        print(f"   Name: {product.heading}")

        return redirect("/products/")

    return render(
        request,
        "edit_product.html",
        {
            "product": product,
            "categories": categories
        }
    )

@jwt_required
def delete_product(request, product_id):

    product = get_object_or_404(
        Product,
        id=product_id
    )

    product.delete()

    return redirect("/products/")




def store_home(request):

    settings_obj = ClientSettings.objects.first()

    return render(
        request,
        f"{settings_obj.theme}/index.html",
        {
            "settings": settings_obj,
            "categories": Category.objects.all(),
            "products": Product.objects.all()
        }
    )

def product_detail(request, slug):

    settings = ClientSettings.objects.first()

    product = Product.objects.get(slug=slug)

    return render(
        request,
        f"{settings.theme}/product-detail.html",
        {
            "settings": settings,
            "product": product
        }
    )

