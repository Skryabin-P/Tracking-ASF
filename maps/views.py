from django.contrib.auth.forms import UserCreationForm
from django.http.response import HttpResponseRedirect
from django.contrib.auth import login
from django.shortcuts import render
from django.urls import reverse
from django.views.generic import ListView
from .forms import NewUserForm,TableContentFilter,SummaryTableFilter
from .models import PointsInfo,EventsCategory
from datetime import datetime
from django.core.paginator import Paginator
from django.db.models import Count,F
import json
def main(response):
    if response.is_ajax():
        if response.method == 'POST':
            dict = response.POST
            print(dict)
            if dict['action'] == 'add':
                category = EventsCategory.objects.get(name=dict['category'])
                db = PointsInfo.objects.create(coord1=dict['coord1'],coord2=dict['coord2'],place=dict['place'],
                                               description=dict['description'],category=category,user=response.user,event_date=dict['event_date'],
                                               url = dict['url'])
                db.save()
            elif dict['action'] == 'delete':
                t = PointsInfo.objects.filter(coord1=dict['coord1'],coord2=dict['coord2'])
                t.delete()

    # print(response.user.is_staff)
    points = PointsInfo.objects.all()
    categories = EventsCategory.objects.all()
    category_list = []
    for category in categories:
        temp = {}
        temp['name'] = category.name
        temp['aliase'] = category.aliase
        category_list.append(temp)

    points_list = []
    for point in points:
        points_dict = {}
        points_dict['coord1'] = point.coord1
        points_dict['coord2'] = point.coord2
        points_dict['place'] = point.place
        points_dict['description'] = point.description
        points_dict['category'] = point.category.name
        points_dict['event_date'] = datetime.strftime(point.event_date,"%d/%m//%Y")
        points_dict['user'] = point.user.username
        points_dict['url'] = point.url
        points_dict['date'] = datetime.strftime(point.date,"%d/%m//%Y")
        points_list.append(points_dict)
    print(category_list)
    context = {'points':json.dumps(points_list),'categories':json.dumps(category_list)}
    print(points_list)

    return render(response,template_name='maps.html',context=context)



def maps_content_table(response):
    filter = TableContentFilter(response.GET,queryset=PointsInfo.objects.all().order_by('-date'))
    fields = ['Дата добавления','Дата происшествия','Место','Описание','Вид события','Кто поставил','Ссылка на источник']
    context = {}
    context['filter'] = filter
    paginated_set = Paginator(filter.qs, 20)
    page_number = response.GET.get('page')
    page_obj = paginated_set.get_page(page_number)
    context['page_obj'] = page_obj
    context['fields'] = fields

    return render(response,'table.html',context)


def maps_stats(response):
    filter = SummaryTableFilter(response.GET,queryset=PointsInfo.objects.all().order_by('-date'))
    fields = ['Наименование','Колличество']
    context = {}
    context['filter'] = filter
    context['fields'] = fields

    q = filter.qs.values("category__aliase").annotate(count = Count(F('category')))
    context['page_obj'] = q
    print(q)
    return render(response,'table.html',context)




def sign_up(response):
    if response.method == 'POST':
        form = NewUserForm(response.POST)
        if form.is_valid():
            user = form.save()
            login(response,user)
            return HttpResponseRedirect(reverse('home'))
    else:
        form = UserCreationForm()
    return render(response, "sign_up.html", {'form': form})
    pass
