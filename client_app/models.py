from django.db import models
from app.models import Client

class ClientSettings(models.Model):
    client = models.OneToOneField(
        Client,
        on_delete=models.CASCADE
    )
    theme = models.CharField(
        max_length=50,
        default="theme1"
    )

    slug = models.SlugField(unique=True,blank=True,null=True)
    logo_link = models.URLField(max_length=500, blank=True, null=True)
    heading = models.CharField(max_length=255, blank=True, null=True)
    tagline = models.CharField(max_length=255, blank=True, null=True)
    search_bar_tagline = models.CharField(max_length=255, blank=True, null=True)
    whatsapp_number = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )
    note = models.TextField(blank=True, null=True)
    sub_note = models.TextField(blank=True, null=True)
    other_note = models.TextField(blank=True, null=True)
    other_subnote = models.TextField(blank=True, null=True)

    payment_methods = models.CharField(max_length=255, blank=True, null=True)
    company_name = models.CharField(max_length=255, blank=True, null=True)

    policy_points = models.JSONField(default=list, blank=True, null=True)

    enable_pickup = models.BooleanField(default=True)
    pickup_start = models.CharField(max_length=5, default="09:00")
    pickup_end = models.CharField(max_length=5, default="21:00")
    
    enable_delivery = models.BooleanField(default=True)
    delivery_start = models.CharField(max_length=5, default="10:00")
    delivery_end = models.CharField(max_length=5, default="19:00")
    
    def __str__(self):
        return self.heading or "Settings"



class Category(models.Model):
    name = models.CharField(max_length=255)
    
    def __str__(self):
        return self.name
    



class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    heading = models.CharField(max_length=255)
    tagline = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    options = models.JSONField(default=dict, blank=True, null=True)
    ingredients = models.TextField(blank=True, null=True)
    add_on_options = models.JSONField(default=dict, blank=True, null=True)
    slug = models.SlugField(
        unique=True,
        blank=True,
        null=True
    )

    image1 = models.CharField(max_length=500, blank=True, null=True)
    image2 = models.CharField(max_length=500, blank=True, null=True)
    image3 = models.CharField(max_length=500, blank=True, null=True)

    def __str__(self):
        return self.heading