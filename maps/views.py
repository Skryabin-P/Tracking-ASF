from django.contrib.auth.forms import UserCreationForm

from django.contrib.auth import login
from django.shortcuts import render
from django.shortcuts import redirect
from .forms import NewUserForm
from .models import PointsInfo
from datetime import datetime
import json
def main(response):
    if response.is_ajax():
        if response.method == 'POST':
            dict = response.POST
            print(dict)
            if dict['action'] == 'add':
                db = PointsInfo.objects.create(coord1=dict['coord1'],coord2=dict['coord2'],place=dict['place'],
                                               description=dict['description'],category=dict['category'],user=response.user)
                db.save()
            elif dict['action'] == 'delete':
                t = PointsInfo.objects.filter(coord1=dict['coord1'],coord2=dict['coord2'])
                t.delete()


    points = PointsInfo.objects.all()
    points_list = []
    for point in points:
        points_dict = {}
        points_dict['coord1'] = point.coord1
        points_dict['coord2'] = point.coord2
        points_dict['place'] = point.place
        points_dict['description'] = point.description
        points_dict['category'] = point.category
        points_dict['user'] = point.user.username
        points_dict['date'] = datetime.strftime(point.date,"%d/%m//%Y")
        points_list.append(points_dict)

    context = {'points':json.dumps(points_list)}
    print(points_list)

    return render(response,template_name='maps.html',context=context)





def sign_up(response):
    if response.method == 'POST':
        form = NewUserForm(response.POST)
        if form.is_valid():
            user = form.save()
            login(response,user)
            redirect("/")
    else:
        form = UserCreationForm()
    return render(response, "sign_up.html", {'form': form})
    pass
