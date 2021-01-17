from django import forms

from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, HTML, Submit

from .models import *

class CreateShoppingList(forms.ModelForm):
    """Form for creating a new shopping list"""
    def __init__(self, *args, **kwargs):
        super(CreateShoppingList, self).__init__(*args, **kwargs)
        # crispy forms
        self.helper = FormHelper()
        self.helper.layout = Layout(
            'list_name',
            Submit('submit', 'Create List', css_class='btn btn-success', css_id='btn-create-list')
        )
    
    class Meta:
        model = ShoppingList

        fields = [
            'list_name'
        ]

class AddToShoppingList(forms.ModelForm):
    """Form for adding items to shopping list"""
    def __init__(self, *args, **kwargs):
        super(AddToShoppingList, self).__init__(*args, **kwargs)
        # crispy forms
        self.helper = FormHelper()
        self.helper.layout = Layout(
            'shopping_list',
            'item',
            'quantity',
            Submit('submit', 'Add Item', css_class='btn btn-primary', css_id='btn-add-item')
        )
        self.helper.form_id = "addToShoppingListForm"
    
    class Meta:
        model = ShoppingListContents

        fields = [
            'shopping_list',
            'item',
            'quantity',
        ]