from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import User, ClientSettings, Category, Product
import json

class SignUpStep1Form(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'password1', 'password2']
        widgets = {
            'username': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Choose a username (this will be your store URL)'
            }),
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['password1'].widget.attrs.update({
            'class': 'form-control',
            'placeholder': 'Enter password'
        })
        self.fields['password2'].widget.attrs.update({
            'class': 'form-control',
            'placeholder': 'Confirm password'
        })

class SignUpStep2Form(forms.Form):
    THEME_CHOICES = [
        ('theme1', 'Theme 1 - Classic'),
        ('theme2', 'Theme 2 - Modern'),
        ('theme3', 'Theme 3 - Minimal'),
    ]
    
    theme = forms.ChoiceField(
        choices=THEME_CHOICES,
        widget=forms.RadioSelect(attrs={'class': 'theme-selector'})
    )

class SignUpStep3Form(forms.ModelForm):
    class Meta:
        model = ClientSettings
        fields = ['heading', 'tagline', 'logo_link', 'whatsapp_number']
        widgets = {
            'heading': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Your store name'
            }),
            'tagline': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'A short tagline'
            }),
            'logo_link': forms.URLInput(attrs={
                'class': 'form-control',
                'placeholder': 'Logo image URL'
            }),
            'whatsapp_number': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'WhatsApp number with country code (e.g., 919876543210)'
            }),
        }

class SignUpStep4Form(forms.ModelForm):
    class Meta:
        model = Category
        fields = ['name']
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Category name (e.g., Cakes, Pastries)'
            })
        }

# Existing forms
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
        fields = ['category', 'heading', 'slug', 'tagline', 'description', 'ingredients']