ymaps.ready(init);
var myMap;

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
    console.log(point['category'])

    var color = get_color(point['category'])
    console.log(color)
    var circle = new ymaps.Circle([

        [point['coord1'], point['coord2']],

        30000
    ], {
        balloonContentHeader: '<strong>Место</strong> ' + point['place'],
        balloonContentBody:  '<strong>Описание</strong> '+ point['description'],
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
            var menuContent =
                '<div id="menu">' +
                    '<ul id="menu_list">'+
                        '<li>Место: <br /> <input type="text" name="place_text" /></li>'+
                        '<li>Описание: <br /> <input type="text" name="describe_text" /></li>'+
                        '<li>Выберете тип: <br /> <select name="category" id="category">'+
                           '<option value="nature">Очаги в дикой природе</option>'+
                            '<option value="home">Очаги домащней свиньи</option>'+
                            '<option value="markets">Мясо, торговые точки</option>'+
                                            '</select>'+
                    '</ul>'+
                '<div align="center"><input class="btn btn-success" id="add" type="submit" value="Добавить" /></div>'+
                '</div>';

            // Размещаем контекстное меню на странице
            $('body').append(menuContent);

            // Задаем позицию меню.
            $('#menu').css({
                left: e.get('pagePixels')[0],
                top: e.get('pagePixels')[1]
            });

            // Заполняем поля контекстного меню текущими значениями свойств метки.
            $('#menu input[name="place_text"]').val(myCircle.properties.get('balloonContentHeader'));
            $('#menu input[name="describe_text"]').val(myCircle.properties.get('balloonContentBody'));
//            $('#menu input[name="balloon_text"]').val(myCircle.properties.get('balloonContent'));

            // При нажатии на кнопку "Сохранить" изменяем свойства метки
            // значениями, введенными в форме контекстного меню.
            $('#menu input[id="add"]').click(function () {

                var place = $('input[name="place_text"]').val()
                var category = $('#menu select[name="category"]').val()
                var color = get_color(category)
                console.log(color)
                console.log(myCircle)
                var description = $('input[name=describe_text]').val()
                myCircle.properties.set({



//                    iconContent: $('input[name="icon_text"]').val(),
//                    hintContent: $('input[name="hint_text"]').val(),
                    balloonContentHeader: '<strong>Место</strong> ' + place,
                    balloonContentBody:  '<strong>Описание</strong> '+ description,
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
                date : today,
                action: "add"
                },
                datatype: 'json',
                success: alert('Точка добавлена')

            })


            });
            }

    ;







})

myMap.geoObjects.events.add('contextmenu',function(e){

var object = e.get('target');
var coords = object.geometry._coordinates
console.log(object)
var place = object.properties._data.balloonContentHeader;
console.log(place)
console.log(coords)

if ($('#deletemenu').css('display') == 'block' ) {
            $('#deletemenu').remove();
        }
         else if ($('#menu').css('display') == 'block' ) {
                $('#menu').remove();

         }

         else {
        var menuContent =
                '<div id="deletemenu">'+'<p>Вы уверены что хотите удалить ' + place + '? </p>'+
                '<div align="center"><input class="btn btn-danger" id="delete" value="удалить" /></div>'+
                '</div>';

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