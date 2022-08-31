ymaps.ready(init);
var myMap;

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
    var circle = new ymaps.Circle([

        [point['coord1'], point['coord2']],
        // Радиус круга в метрах.
        30000
    ], {
        balloonContentHeader: '<strong>Место</strong> ' + point['place'],
        balloonContentBody:  '<strong>Описание</strong> '+ point['description'],
        balloonContentFooter: '<strong>Кем добавлено</strong> '+ point['user'] + '<br> <strong>Дата добавления</strong> '+point['date'] ,
    }, {

        draggable: false,

        fillColor: "#DB709377",

        strokeColor: "#990066",
        strokeOpacity: 0.8,
        // Ширина обводки в пикселях.
        strokeWidth: 5
    })
    myMap.geoObjects.add(circle);
    //Do something
}

}


    if(logged === "True"){
    myMap.events.add('click', function (e) {
         var coords = e.get('coords');


         var myCircle = new ymaps.Circle([
        // Коодринаты центра круга.
        [coords[0], coords[1]],
        // Радиус круга в метрах.
        30000
    ], {
        // Описываем свойства круга.
        // Содержимое балуна.
//        balloonContent: user,
        // Содержимое хинта.
//        hintContent: "Подвинь меня"
    }, {
        // Задаем опции круга.
        // Включаем возможность перетаскивания круга.
        draggable: false,
        // Цвет заливки.
        // Последний байт (77) определяет прозрачность.
        // Прозрачность заливки также можно задать используя опцию "fillOpacity".
        fillColor: "#DB709377",
        // Цвет обводки.
        strokeColor: "#990066",
        // Прозрачность обводки.
        strokeOpacity: 0.8,
        // Ширина обводки в пикселях.
        strokeWidth: 5
    })

    // Если меню метки уже отображено, то убираем его.
        if ($('#menu').css('display') == 'block') {
            $('#menu').remove();
        } else {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();

            today = mm + '/' + dd + '/' + yyyy;
            // HTML-содержимое контекстного меню.
            var menuContent =
                '<div id="menu">\
                    <ul id="menu_list">\
                        <li>Место: <br /> <input type="text" name="place_text" /></li>\
                        <li>Описание: <br /> <input type="text" name="describe_text" /></li>\
                        <li>Балун: <br /> <input type="text" name="balloon_text" /></li>\
                    </ul>\
                <div align="center"><input type="submit" value="Добавить" /></div>\
                </div>';

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
            $('#menu input[type="submit"]').click(function () {
                var place = $('input[name="place_text"]').val()
                var description = $('input[name=describe_text]').val()
                myCircle.properties.set({



//                    iconContent: $('input[name="icon_text"]').val(),
//                    hintContent: $('input[name="hint_text"]').val(),
                    balloonContentHeader: '<strong>Место</strong> ' + place,
                    balloonContentBody:  '<strong>Описание</strong> '+ description,
                    balloonContentFooter: '<strong>Кем добавлено</strong> '+ user + '<br> <strong>Дата добавления</strong> '+today ,


                });
                // Удаляем контекстное меню.
                $('#menu').remove();

                // Добавляем круг на карту.
    myMap.geoObjects.add(myCircle);
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    $.ajax({
                url: '',
                type: 'POST',
                 headers: { "X-CSRFToken": token },
                data: {coord1: coords[0],
                coord2: coords[1],
                place: place,
                description: description,
                user : user,
                date : today,
                },
                datatype: 'json',
                success: alert('Точка добавлена')

            })


            });
            }

    ;







})
}
}