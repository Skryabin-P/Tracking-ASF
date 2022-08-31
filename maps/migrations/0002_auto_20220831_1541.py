# Generated by Django 3.2.15 on 2022-08-31 12:41

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('maps', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='pointsinfo',
            name='date',
            field=models.DateField(auto_now_add=True, null=True),
        ),
        migrations.AddField(
            model_name='pointsinfo',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='pointsinfo',
            name='coord1',
            field=models.FloatField(blank=True, max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='pointsinfo',
            name='coord2',
            field=models.FloatField(blank=True, max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='pointsinfo',
            name='place',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]
