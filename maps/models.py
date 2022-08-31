from django.db import models

# Create your models here.

from django.db import models
from django.contrib.auth.models import User


class PointsInfo(models.Model):
    coord1 = models.FloatField(max_length=200, blank=True, null=True)
    coord2 = models.FloatField(max_length=200, blank=True, null=True)
    place = models.CharField(max_length=200, blank=True, null=True)
    description = models.CharField(max_length=500)
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    date = models.DateField(auto_now_add=True, blank=True, null=True)
