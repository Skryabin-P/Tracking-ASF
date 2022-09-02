import django_filters
from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import PointsInfo,EventsCategory

class NewUserForm(UserCreationForm):


	class Meta:
		model = User
		fields = ("username", "password1", "password2")

	def save(self, commit=True):
		user = super(NewUserForm, self).save(commit=False)
		if commit:
			user.save()
		return user


class TableContentFilter(django_filters.FilterSet):
	date = django_filters.DateFromToRangeFilter(widget=django_filters.widgets.RangeWidget(
		attrs={'type': 'date', 'class': 'btn btn-outline-primary'}
	), label='Период добавления')
	event_date = django_filters.DateFromToRangeFilter(widget=django_filters.widgets.RangeWidget(
		attrs={'type': 'date', 'class': 'btn btn-outline-primary'}
	), label='Период происшествий')
	category = forms.ModelChoiceField(queryset=EventsCategory.objects.all(),
										label='Вид события')
	user = forms.ModelChoiceField(queryset=User.objects.all(), label='Кто поставил область')

	class Meta:
		model = PointsInfo
		fields = ['date','event_date','category','user']


class SummaryTableFilter(django_filters.FilterSet):
	date = django_filters.DateFromToRangeFilter(widget=django_filters.widgets.RangeWidget(
		attrs={'type': 'date', 'class': 'btn btn-outline-primary'}
	), label='Период добавления')
	event_date = django_filters.DateFromToRangeFilter(widget=django_filters.widgets.RangeWidget(
		attrs={'type': 'date', 'class': 'btn btn-outline-primary'}
	), label='Период происшествий')


	class Meta:
		model = PointsInfo
		fields = ['date','event_date']
