from django.urls import path
from . import views

app_name = 'shoppinglist'

urlpatterns = [
    path('', views.index, name='index'),

    # AJAX calls
    path('ajax/add_item_to_list/', views.ajax_add_item_to_list, name='ajax_add_item_to_list'),
]
