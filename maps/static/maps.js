ymaps.ready(init);
var myMap;



// if url doen't contain http:// or https then add https://
function validateURL(link)
{
    if (link.indexOf("http://") == 0 || link.indexOf("https://") == 0) {
        return link
    }
    else{
        return 'https://'+link
    }
}

// get color depends on circle category
function get_color(category){

switch(category){
    case "nature":
    return ["#228B22","#006400"];  // green
    break;
    case "home":
    return ["#FF0000","#B30000"]; //red
    break;
    case "markets":
    return ["#6495ED","#00008B"] //blue
    break;
    default:
    return ["#000000","#000000"] //black
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

    // add circles on map from DB
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
        // if user have rights then allow him to add or delete circles



// add circle on map
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
// input parameters of the circle
    // if menu already displayed then remove it
        if ($('#rmenu').css('display') == 'block') {
            $('#rmenu').remove();

       }

         else {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            var yyyy = today.getFullYear();
            // today date
            today =  dd + '/' + mm + '/' + yyyy;

            var select_string = ''

            var arraylen = categories.length
            // options for select tag
            for (var i = 0; i < arraylen; i++) {
                category = categories[i];

                select_string = select_string + '<option value="' + category["name"]+'">' + category["aliase"] + '</option>'


                }
            // html menu content
            var menuContent =
            '<div class=rightside id=rmenu>'+
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

            // add menu to body of html
            $('body').append(menuContent);
            document.getElementById('rmenu').style = 'top:' + height * 0.15 + 'px' +';' + 'left:' + width * 1.17 + 'px';
            // click on Add button
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
                // set baloon properties
                myCircle.properties.set({
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
                // delete menu
                $('#menu').remove();
                $('#rmenu').remove();
                // add circle on map
    myMap.geoObjects.add(myCircle);
    // send ajax to django
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
// similarly as previous, but it add circle in the area of another circle
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

        if ($('#rmenu').css('display') == 'block') {
            $('#rmenu').remove();

       } else {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            var yyyy = today.getFullYear();

            today =  dd + '/' + mm + '/' + yyyy;

            var select_string = ''

            var arraylen = categories.length

            for (var i = 0; i < arraylen; i++) {
                category = categories[i];

                select_string = select_string + '<option value="' + category["name"]+'">' + category["aliase"] + '</option>'


                }

            var menuContent =
            '<div class=rightside id=rmenu >'+
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


            $('body').append(menuContent);
            document.getElementById('rmenu').style = 'top:' + height * 0.15 + 'px' +';' + 'left:' + width * 1.17 + 'px';

            console.log(e.get('pagePixels'));





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

                $('#menu').remove();
                $('#rmenu').remove();

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

// delete circle by clicking right mouse button
myMap.geoObjects.events.add('contextmenu',function(e){

var object = e.get('target');
var coords = object.geometry._coordinates

var place = object.properties._data.balloonContentHeader;


// if deletemenu already showed then delete it
if ($('#rmenu').css('display') == 'block') {
            $('#rmenu').remove();

       }

         else {
         // delete menu html content
        var menuContent =
                '<div class=rightside id=rmenu>'+
                '<div id="deletemenu">'+'<p>Вы уверены что хотите удалить ' + place + '? </p>'+
                '<div align="center"><input class="btn btn-danger" id="delete" value="удалить" /></div>'+
                '</div></div>';
        // add deletemenu in the html body
         $('body').append(menuContent);
         document.getElementById('rmenu').style = 'top:' + height * 0.15 + 'px' +';' + 'left:' + width * 1.17 + 'px';
         $('#deletemenu input[id="delete"]').click(function () {
         $('#deletemenu').remove();
         $('#rmenu').remove();
         //send ajax to django
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
        // remove circle
        myMap.geoObjects.remove(object)

        })






}



})
}
}