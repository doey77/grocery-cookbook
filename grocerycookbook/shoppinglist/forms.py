from django import forms

from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, HTML, Submit

from .models import *

class AddToShoppingList(forms.Form):
    """Form for adding to shopping list"""
    list_item = forms.CharField(required=True, max_length=128)

    def __init__(self, *args, **kwargs):
        super(AddToShoppingList, self).__init__(*args, **kwargs)
        # crispy forms
        self.helper = FormHelper()
        self.helper.layout = Layout(
            'list_item',
            Submit('submit', 'Add Item', css_class='btn btn-primary')
        )
        self.helper.form_id = "addToShoppingListForm"