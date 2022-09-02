ymaps.ready(init);
var myMap;
function validateURL(link)
{
    if (link.indexOf("http://") == 0 || link.indexOf("https://") == 0) {
        return link
    }
    else{
        return 'https://'+link
    }
}
function get_color(category){

switch(category){
    case "nature":
    return ["#228B22","#006400"];
    break;
    case "home":
    return ["#FF0000","#B30000"];
    break;
    case "markets":
    return ["#6495ED","#00008B"]
    break;
    default:
    return ["#000000","#000000"]
}



}


function init () {
    myMap = new ymaps.Map("map", {
        center: [57.5262, 38.3061], // Углич
        zoom: 7
    }, {
        balloonMaxWidth: 200,
        searchControlProvider: 'yandex#search'
    });



    var arrayLength = points.length;
    if (arrayLength > 0) {

    var collection = new ymaps.GeoObjectCollection(null, {
        // Запретим появление балуна.
        hasBalloon: false,
        iconColor: '#3b5998'
    });
    for (var i = 0; i < arrayLength; i++) {
    point = points[i];

    var color = get_color(point['category'])

    var circle = new ymaps.Circle([

        [point['coord1'], point['coord2']],

        30000
    ], {
        balloonContentHeader: '<strong>Место</strong> ' + point['place'],
        balloonContentBody:  '<strong>Описание</strong> '+ point['description']+ '<br> <strong>Дата происшествия</strong>: '+ point['event_date']+
                    "<br><a target='_blank' class='btn btn-primary btn-sm' href=" + point['url'] + ">Ссылка на источник</a>",
        balloonContentFooter: '<strong>Кем добавлено</strong> '+ point['user'] + '<br> <strong>Дата добавления</strong> '+point['date'] ,
    }, {

        draggable: false,

        fillColor: color[0],
        fillOpacity: 0.3,
        strokeColor: color[1],
        strokeOpacity: 0.8,

        strokeWidth: 5
    })
    myMap.geoObjects.add(circle);

}

}


    if(logged === "True"){




// круг на пустое место
    myMap.events.add('click', function (e) {
         var coords = e.get('coords');

         var myCircle = new ymaps.Circle([
        // center circle coordinates
        [coords[0], coords[1]],
        // circle radius
        30000
    ], {
        //circle properties
    }, )
// Добавление круга на карту, задание параметров
    // Если меню метки уже отображено, то убираем его.
        if ($('#menu').css('display') == 'block') {
            $('#menu').remove();

       }
       else if ($('#deletemenu').css('display') == 'block' ) {
                $('#deletemenu').remove();
        } else {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            var yyyy = today.getFullYear();

            today =  dd + '/' + mm + '/' + yyyy;
            // HTML-содержимое контекстного меню.
            var select_string = ''

            var arraylen = categories.length

            for (var i = 0; i < arraylen; i++) {
                category = categories[i];

                select_string = select_string + '<option value="' + category["name"]+'">' + category["aliase"] + '</option>'


                }

            var menuContent =
            '<div class=rightside>'+
                '<div id="menu">' +
                    '<ul id="menu_list">'+
                        '<li>Место: <br /> <input type="text" name="place_text" /></li>'+
                        '<li>Описание: <br /> <input type="text" name="describe_text" /></li>'+
                        '<li> Дата происшествия: <br/> <input type="date" name="event_date"></li>'+
                        '<li>Выберете тип: <br /> <select name="category" id="category">'+
                                        select_string +
                                            '</select>'+ '<li> Ссылка на источник:<br> <input type="url" name="url"></li>'+
                    '</ul>'+
                '<div align="center"><input class="btn btn-success" id="add" type="submit" value="Добавить" /></div>'+

                '</div></div>' ;

            // Размещаем контекстное меню на странице
            $('body').append(menuContent);

            // Задаем позицию меню.
            console.log(e.get('pagePixels'));

//            $('#menu div[id="menu"]').css({
//            position:"absolute",
//            top: "e.get('pagePixels')[0]" + "px",
//            left: "e.get('pagePixels')[1]" + "px",
//            })



            // Заполняем поля контекстного меню текущими значениями свойств метки.
            $('#menu input[name="place_text"]').val(myCircle.properties.get('balloonContentHeader'));
            $('#menu input[name="describe_text"]').val(myCircle.properties.get('balloonContentBody'));
//            $('#menu input[name="balloon_text"]').val(myCircle.properties.get('balloonContent'));

            // При нажатии на кнопку "Сохранить" изменяем свойства метки
            // значениями, введенными в форме контекстного меню.
            $('#menu input[id="add"]').click(function () {

                var place = $('input[name="place_text"]').val()
                var category = $('#menu select[name="category"]').val()
                var event_date = $('#menu input[name="event_date"]').val()
                var url = $('#menu input[name="url"]').val()
                url = validateURL(url)
                console.log(event_date)
                console.log(url)
                var color = get_color(category)
                console.log(color)
                console.log(myCircle)
                var description = $('input[name=describe_text]').val()
                myCircle.properties.set({



//                    iconContent: $('input[name="icon_text"]').val(),
//                    hintContent: $('input[name="hint_text"]').val(),
                    balloonContentHeader: '<strong>Место</strong> ' + place,
                    balloonContentBody:  '<strong>Описание</strong> '+ description + '<br> <strong>Дата происшествия</strong>: '+ event_date+
                    "<br><a target='_blank' class='btn btn-primary btn-sm' href=" + url + ">Ссылка на источник</a>" ,
                    balloonContentFooter: '<strong>Кем добавлено</strong> '+ user + '<br> <strong>Дата добавления</strong> '+today ,


                }, );
              myCircle.options.set({

            draggable: false,

            fillColor: color[0],

            strokeColor: color[1],
            fillOpacity: 0.3,
            strokeOpacity: 0.8,

            strokeWidth: 5
            })
                // Удаляем контекстное меню.
                $('#menu').remove();

                // Добавляем круг на карту.
    myMap.geoObjects.add(myCircle);

    $.ajax({
                url: '',
                type: 'POST',
                 headers: { "X-CSRFToken": token },
                data: {coord1: coords[0],
                coord2: coords[1],
                place: place,
                description: description,
                category: category,
                user : user,
                url : url,
                date : today,
                event_date: event_date,
                action: "add"
                },
                datatype: 'json',
                success: alert('Точка добавлена')

            })


            });
            };







})

myMap.geoObjects.events.add('click',function(e){

var coords = e.get('coords');

         var myCircle = new ymaps.Circle([
        // center circle coordinates
        [coords[0], coords[1]],
        // circle radius
        30000
    ], {
        //circle properties
    }, )
// Добавление круга на карту, задание параметров
    // Если меню метки уже отображено, то убираем его.
        if ($('#menu').css('display') == 'block') {
            $('#menu').remove();

       }
       else if ($('#deletemenu').css('display') == 'block' ) {
                $('#deletemenu').remove();
        } else {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            var yyyy = today.getFullYear();

            today =  dd + '/' + mm + '/' + yyyy;
            // HTML-содержимое контекстного меню.
            var select_string = ''

            var arraylen = categories.length

            for (var i = 0; i < arraylen; i++) {
                category = categories[i];

                select_string = select_string + '<option value="' + category["name"]+'">' + category["aliase"] + '</option>'


                }

            var menuContent =
            '<div class=rightside>'+
                '<div id="menu">' +
                    '<ul id="menu_list">'+
                        '<li>Место: <br /> <input type="text" name="place_text" /></li>'+
                        '<li>Описание: <br /> <input type="text" name="describe_text" /></li>'+
                        '<li> Дата происшествия: <br/> <input type="date" name="event_date"></li>'+
                        '<li>Выберете тип: <br /> <select name="category" id="category">'+
                                        select_string +
                                            '</select>'+ '<li> Ссылка на источник:<br> <input type="url" name="url"></li>'+
                    '</ul>'+
                '<div align="center"><input class="btn btn-success" id="add" type="submit" value="Добавить" /></div>'+

                '</div></div>' ;

            // Размещаем контекстное меню на странице
            $('body').append(menuContent);

            // Задаем позицию меню.
            console.log(e.get('pagePixels'));

//            $('#menu div[id="menu"]').css({
//            position:"absolute",
//            top: "e.get('pagePixels')[0]" + "px",
//            left: "e.get('pagePixels')[1]" + "px",
//            })



            // Заполняем поля контекстного меню текущими значениями свойств метки.
            $('#menu input[name="place_text"]').val(myCircle.properties.get('balloonContentHeader'));
            $('#menu input[name="describe_text"]').val(myCircle.properties.get('balloonContentBody'));
//            $('#menu input[name="balloon_text"]').val(myCircle.properties.get('balloonContent'));

            // При нажатии на кнопку "Сохранить" изменяем свойства метки
            // значениями, введенными в форме контекстного меню.
            $('#menu input[id="add"]').click(function () {

                var place = $('input[name="place_text"]').val()
                var category = $('#menu select[name="category"]').val()
                var event_date = $('#menu input[name="event_date"]').val()
                var url = $('#menu input[name="url"]').val()
                url = validateURL(url)
                console.log(event_date)
                console.log(url)
                var color = get_color(category)
                console.log(color)
                console.log(myCircle)
                var description = $('input[name=describe_text]').val()
                myCircle.properties.set({



//                    iconContent: $('input[name="icon_text"]').val(),
//                    hintContent: $('input[name="hint_text"]').val(),
                    balloonContentHeader: '<strong>Место</strong> ' + place,
                    balloonContentBody:  '<strong>Описание</strong> '+ description + '<br> <strong>Дата происшествия</strong>: '+ event_date+
                    "<br><a target='_blank' class='btn btn-primary btn-sm' href=" + url + ">Ссылка на источник</a>" ,
                    balloonContentFooter: '<strong>Кем добавлено</strong> '+ user + '<br> <strong>Дата добавления</strong> '+today ,


                }, );
              myCircle.options.set({

            draggable: false,

            fillColor: color[0],

            strokeColor: color[1],
            fillOpacity: 0.3,
            strokeOpacity: 0.8,

            strokeWidth: 5
            })
                // Удаляем контекстное меню.
                $('#menu').remove();

                // Добавляем круг на карту.
    myMap.geoObjects.add(myCircle);

    $.ajax({
                url: '',
                type: 'POST',
                 headers: { "X-CSRFToken": token },
                data: {coord1: coords[0],
                coord2: coords[1],
                place: place,
                description: description,
                category: category,
                user : user,
                url : url,
                date : today,
                event_date: event_date,
                action: "add"
                },
                datatype: 'json',
                success: alert('Точка добавлена')

            })


            });
            };


}



)


myMap.geoObjects.events.add('contextmenu',function(e){

var object = e.get('target');
var coords = object.geometry._coordinates

var place = object.properties._data.balloonContentHeader;



if ($('#deletemenu').css('display') == 'block' ) {
            $('#deletemenu').remove();
        }
         else if ($('#menu').css('display') == 'block' ) {
                $('#menu').remove();

         }

         else {
        var menuContent =
                '<div class=rightside>'+
                '<div id="deletemenu">'+'<p>Вы уверены что хотите удалить ' + place + '? </p>'+
                '<div align="center"><input class="btn btn-danger" id="delete" value="удалить" /></div>'+
                '</div></div>';

         $('body').append(menuContent);
         $('#deletemenu input[id="delete"]').click(function () {
         $('#deletemenu').remove();
         $.ajax({
                url: '',
                type: 'POST',
                 headers: { "X-CSRFToken": token },
                data: {coord1: coords[0],
                coord2: coords[1],
                action: "delete"
                },
                datatype: 'json',
                success: alert('Точка удалена')

            })
        myMap.geoObjects.remove(object)

        })






}



})
}
}