from django.urls import path , include , re_path
from .views import signup,  login_view
from django.views.static import serve

urlpatterns = [
    path("signup/", signup, name="signup"),
    # path("signup-success/", signup_success, name="signup_success"),
    path("login/",login_view,name="login"),


    path("", include("client_app.urls")),

    
    
]