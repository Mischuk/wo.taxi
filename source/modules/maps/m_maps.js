ymaps.ready(function () {
    var settingsMarker = {
        iconLayout: 'default#image',
        iconImageHref: 'images/marker.png',
        iconImageSize: [117, 136],
        iconImageOffset: [-62, -119]
    };
    var settingsBaloon = { hintContent: '', balloonContent: '' };

    var coord_1 = [60.016186, 30.310793];
    var coord_2 = [55.75396, 37.620393];
    var coord_3 = [56.838607, 60.605514];


    var myMap = new ymaps.Map('map', {
        center: coord_1,
        zoom: 14,
        controls: ['zoomControl']
    }, { searchControlProvider: 'yandex#search'} ),

    myPlacemark_1 = new ymaps.Placemark(coord_1, settingsBaloon, settingsMarker);
    myPlacemark_2 = new ymaps.Placemark(coord_2, settingsBaloon, settingsMarker);
    myPlacemark_3 = new ymaps.Placemark(coord_3, settingsBaloon, settingsMarker);

    myMap.geoObjects.add(myPlacemark_1);
    myMap.geoObjects.add(myPlacemark_2);
    myMap.geoObjects.add(myPlacemark_3);

    myMap.behaviors.disable('scrollZoom');

    // Set center on click


    $('select').selectric({
        disableOnMobile: false,
        responsive: true
    });
    $('select').selectric().on('change', function() {
        var eq = $(this).val();

        $('#popup-maps .body .place').removeClass('current');
        $('#popup-maps .body .place').eq(eq-1).addClass('current');

        if ( eq == 1 ) { myMap.setCenter(coord_1, 14); }
        if ( eq == 2 ) { myMap.setCenter(coord_2, 14); }
        if ( eq == 3 ) { myMap.setCenter(coord_3, 14); }
    });
});


