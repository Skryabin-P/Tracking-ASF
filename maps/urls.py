from django.urls import path,include
import os
import sys
from . import views

urlpatterns = [

    path('', include("django.contrib.auth.urls")),
    # map page
    path('', views.main, name='home'),
    path('sign_up', views.sign_up, name='sign_up'),
    # table contains all points are added to map
    path('maps_table',views.maps_content_table, name='maps_table'),
    # result stats of all points
    path('maps_stats', views.maps_stats,name='maps_stats')
]