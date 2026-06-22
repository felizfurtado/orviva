from django.db import models
from django_tenants.models import TenantMixin, DomainMixin


class Client(TenantMixin):
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)

    auto_create_schema = True

    def __str__(self):
        return self.username


class Domain(DomainMixin):
    pass