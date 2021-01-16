from django.db import models
from django.contrib.auth.models import User

class ShoppingList(models.Model):
    """Model for the overall shopping list"""
    id = models.AutoField(primary_key=True)
    list_name = models.CharField(max_length=64, unique=True) # need to rework; no 2 users could have the same list name
    username = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.list_name


class ShoppingListContents(models.Model):
    """Model to hold shopping list contents"""
    id = models.AutoField(primary_key=True)
    shopping_list = models.ForeignKey(ShoppingList, on_delete=models.CASCADE)
    item = models.CharField(max_length=255)
    quantity = models.IntegerField(default=1)
