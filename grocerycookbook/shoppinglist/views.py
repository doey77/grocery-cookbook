from django.contrib import messages
from django.shortcuts import render

from .forms import *

def index(request):
    """Main shopping list page; handles create list forms and add list items form"""

    # Forms
    add_to_shopping_list = AddToShoppingList()

    if request.method == 'POST':

        if request.POST.get('submit') == 'Create List':
            create_shopping_list = CreateShoppingList(request.POST)

            if create_shopping_list.is_valid():
                obj = create_shopping_list.save(commit=False)
                obj.username = request.user
                obj.save()
            else:
                messages.error(request, "Shopping list already exists")

        elif request.POST.get('submit') == 'Add Item':
            add_to_shopping_list = AddToShoppingList(request.POST)
        
            if add_to_shopping_list.is_valid():
                add_to_shopping_list.save()
            
            # Create new form but maintain last selected list
            add_to_shopping_list = AddToShoppingList(initial={'shopping_list':add_to_shopping_list.data.get('shopping_list')})
    
    create_shopping_list = CreateShoppingList()

    # Table for viewing lists
    user_lists = ShoppingList.objects.filter(username=request.user).values_list('list_name') # look into possibility of spoofing user requests
    list_names = []
    for name in user_lists:
        list_names.append(name[0])
    
    user_list_contents = ShoppingListContents.objects.filter(shopping_list__list_name__in=list_names)

    context = {
        'add_to_shopping_list_form': add_to_shopping_list,
        'create_shopping_list_form': create_shopping_list,
        'user_list_contents': user_list_contents,
    }

    return render(request, 'shoppinglist/index.html', context)