from django.shortcuts import render

from .forms import *

def index(request):

    context = {
        'add_to_shopping_list_form': AddToShoppingList(),
    }

    return render(request, 'shoppinglist/index.html', context)