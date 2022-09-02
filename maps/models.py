from django.db import models

# Create your models here.

from django.db import models
from django.contrib.auth.models import User

class EventsCategory(models.Model):
    name = models.CharField(max_length=200)
    aliase = models.CharField(max_length=200)
    def __str__(self):
        return self.aliase

class PointsInfo(models.Model):
    coord1 = models.FloatField(max_length=200, blank=True, null=True)
    coord2 = models.FloatField(max_length=200, blank=True, null=True)
    place = models.CharField(max_length=200, blank=True, null=True)
    description = models.CharField(max_length=500)
    category = models.ForeignKey(EventsCategory,on_delete=models.CASCADE, blank=True,null=True, verbose_name='Вид события')
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True,verbose_name='Кто поставил')
    date = models.DateField(auto_now_add=True, blank=True, null=True)
    event_date = models.DateField(auto_now_add=False, blank=True, null=True)
    url = models.URLField(blank=True,null=True)
    def values(self):
        return self.date,self.event_date,  self.place, self.description, self.category.aliase, self.user.username,self.url