from django.shortcuts import render, redirect
from django import forms
import json
from .models import *

def index(request):

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


class ClientSettingsForm(forms.ModelForm):
    class Meta:
        model = ClientSettings
        fields = '__all__'

class CategoryForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = '__all__'

class ProductForm(forms.ModelForm):
    options_json = forms.CharField(widget=forms.Textarea, required=False, 
        help_text='Enter JSON format: {"1/2 kg": "500", "1 kg": "900"}')
    add_on_json = forms.CharField(widget=forms.Textarea, required=False,
        help_text='Enter JSON format: {"Extra frosting": "50", "Birthday topper": "100"}')
    
    class Meta:
        model = Product
        fields = ['category', 'heading','slug', 'tagline', 'description', 'ingredients'  ]


        
def client_settings_view(request):
    settings_obj = ClientSettings.objects.first()
    
    if not settings_obj:
        settings_obj = ClientSettings.objects.create()
    
    # Handle category deletion
    if request.method == 'POST' and 'delete_category' in request.POST:
        try:
            category_id = request.POST.get('delete_category')
            Category.objects.filter(id=category_id).delete()
            return redirect('client_settings')
        except:
            pass
    
    # Handle store deletion
    if request.method == 'POST' and 'delete_store' in request.POST:
        try:
            settings_obj.delete()
            return redirect('some_home_page')
        except:
            pass
    
    # Initialize forms
    form = ClientSettingsForm(instance=settings_obj)
    cat_form = CategoryForm()
    
    if request.method == 'POST':
        if 'save_settings' in request.POST:
            form = ClientSettingsForm(request.POST, instance=settings_obj)
            if form.is_valid():
                form.save()
                return redirect('client_settings')
        
        elif 'add_category' in request.POST:
            cat_form = CategoryForm(request.POST)
            if cat_form.is_valid():
                cat_form.save()
                return redirect('client_settings')
    
    return render(
        request,
        'settings_form.html',
        {
            'form': form,
            'cat_form': cat_form,
            'settings': settings_obj,
            'categories': Category.objects.all()
        }
    )

def product_view(request):
    products = Product.objects.all()
    return render(request, 'products.html', {'products': products})

def add_product(request):
    if request.method == 'POST':

        form = ProductForm(request.POST)

        if form.is_valid():

            product = form.save(commit=False)

            options_json = request.POST.get(
                'options_json',
                '{}'
            )

            add_on_json = request.POST.get(
                'add_on_json',
                '{}'
            )

            try:
                product.options = json.loads(options_json)
            except:
                product.options = {}

            try:
                product.add_on_options = json.loads(add_on_json)
            except:
                product.add_on_options = {}

            product.save()

            return redirect('products')

    else:
        form = ProductForm()

    return render(
        request,
        'add_product.html',
        {
            'form': form
        }
    )