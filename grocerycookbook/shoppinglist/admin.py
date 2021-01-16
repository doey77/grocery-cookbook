from django.contrib import admin
from .models import *

class ShoppingListAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'list_name',
        'username',
    )
admin.site.register(ShoppingList, ShoppingListAdmin)

class ShoppingListContentsAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'shopping_list',
        'item',
        'quantity',
    )
admin.site.register(ShoppingListContents, ShoppingListContentsAdmin)