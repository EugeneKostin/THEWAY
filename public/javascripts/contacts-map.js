function contactsMap() {
    ymaps.ready( () => {
        let contactsMap = new ymaps.Map("contacts__map", {
            center: [44.716, 37.778],
            controls: ['searchControl', 'geolocationControl', 'typeSelector', 'zoomControl', 'routeButtonControl', 'fullscreenControl'],
            zoom: 14
        });
        // Создание геообъекта с типом точка (метка).
        let myPlacemark = new ymaps.Placemark([44.718655, 37.781102], {iconCaption: "Мы здесь"}, {preset: 'islands#greenHeartIcon'});
        contactsMap.geoObjects.add(myPlacemark);

        document.querySelector('.ymaps-2-1-77-copyrights-pane').style.display = 'none';
    });
};