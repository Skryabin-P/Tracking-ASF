from django.urls import path,include
import os
import sys
from . import views

urlpatterns = [

    path('', include("django.contrib.auth.urls")),
    path('', views.main, name='home'),
    path('sign_up', views.sign_up, name='sign_up'),
]