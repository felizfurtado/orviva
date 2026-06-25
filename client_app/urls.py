from django.urls import path , re_path
from .views import *
from django.views.static import serve

urlpatterns = [

#signup
    # path("", tenant_test),
    path("step2/<int:client_id>/", step2, name="step2"),
    path("step3/<int:client_id>/", step3, name="step3"),
    path("step4/<int:client_id>/", step4, name="step4"),


#login
    path("dashboard/", dashboard, name="dashboard"),
    path("products/",products,name="products"),
    path("categories/",categories,name="categories"),
    path("profile/",profile,name="profile"),
    path("add-product/",add_product,name="add_products"),
    path("add-category/",add_category,name="add_category"),
    path("edit-category/<int:category_id>/",edit_category,name="edit_category"),
    path("delete-category/<int:category_id>/", delete_category, name="delete_category"),
    path("edit-product/<int:product_id>/",edit_product,name="edit_products"),
    path("delete-product/<int:product_id>/",delete_product,name="delete_product"),
    path('store-status/', toggle_store_status, name='toggle_store_status'),

#livestore
    path("",store_home,name="store_home"),
    path("product/<slug:slug>/",product_detail,name="product_detail"),

    re_path(
    r"^(?P<path>tenants/.*)$",
    serve,
    {
        "document_root": ".",
    },
)


    

]