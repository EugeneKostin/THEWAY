function checkoutMap() {
    map_trigger = document.querySelector('.checkout__map')
    map_trigger.addEventListener("click", () => {
        document.querySelector('#map').classList.add('active')
    });
    ymaps.ready( () => {
        let location = ymaps.geolocation;
        let myPlacemark, myMap = new ymaps.Map('map', {
            center: [59.95748602296879, 30.308310711845216],
            zoom: 11,
            controls: ['searchControl', 'geolocationControl', 'typeSelector', 'zoomControl']
        }, {
            searchControlProvider: 'yandex#map'
        });
        searchControl = myMap.controls.get('searchControl');
        searchControl.options.set({noPlacemark: true, suppressYandexSearch: true, placeholderContent: 'Введите адрес доставки'});

        let closeButton = new ymaps.control.Button("Закрыть");
        myMap.controls.add(closeButton, {float: 'right'});

        let submitButton = new ymaps.control.Button({
            data: { content: 'Выбрать' },
            options: {
                layout: ymaps.templateLayoutFactory.createClass(
                    "<div class='map__message'>Укажите на карте место доставки</div><div class='map__address'></div>" + "<div class='map__submit'>" + "{{ data.content }}" + "</div>"
                ),
                }});
        myMap.controls.add(submitButton, { float: 'none', position: {left: '50%', bottom: '10px'} });

        // Получение местоположения и автоматическое отображение его на карте.
        location.get({
            // provider: browser - Geolocation API,: yandex - По ip-адресу
            mapStateAutoApply: true
        })
        .then(
            function(res) {
                // Получение местоположения пользователя.
                //let userAddress = res.geoObjects.get(0).getAddressLine();
                var userCoodinates = res.geoObjects.get(0).geometry.getCoordinates();
                checkPlacemark(userCoodinates);
                getAddress(userCoodinates);
            },
            function(err) {
                //console.log('Ошибка: ' + err)
            }
        );

        myMap.events.add('click', function (e) {
            var coords = e.get('coords');
            // Если метка уже создана – просто передвигаем ее.
            checkPlacemark(coords);
            getAddress(coords);
        });
        function checkPlacemark(coords) {
            if (myPlacemark) {
                myPlacemark.geometry.setCoordinates(coords);
            }
            // Если нет – создаем.
            else {
                myPlacemark = createPlacemark(coords);
                myMap.geoObjects.add(myPlacemark);
                // Слушаем событие окончания перетаскивания на метке.
                myPlacemark.events.add('dragend', function () {
                    getAddress(myPlacemark.geometry.getCoordinates());
                });
            }
        }
        // Создание метки.
        function createPlacemark(coords) {
            return new ymaps.Placemark(coords, {
                iconCaption: 'поиск...'
            }, {
                preset: 'islands#greenHeartIcon',
                draggable: true,
                openEmptyBalloon: false,
                //iconLayout: myIcon,
            });
        }
        // Определяем адрес по координатам (обратное геокодирование).
        let curAddress;

        function getAddress(coords) {
            myPlacemark.properties.set('iconCaption', 'поиск...');
            ymaps.geocode(coords).then(function (res) {
                var firstGeoObject = res.geoObjects.get(0);
                curAddress = [firstGeoObject.getLocalities(), firstGeoObject.getThoroughfare() || firstGeoObject.getPremise(), firstGeoObject.getPremiseNumber() || ''].filter(Boolean).join(', ');
                myPlacemark.properties
                    .set({
                        // Формируем строку с данными об объекте.
                        iconCaption: [
                            // Получаем путь до топонима, если метод вернул null, запрашиваем наименование здания.
                            firstGeoObject.getThoroughfare() || firstGeoObject.getPremise(),
                            //номер здания
                            firstGeoObject.getPremiseNumber(),
                        ].filter(Boolean).join(', '),
                        // В качестве контента балуна задаем строку с адресом объекта.
                    });
                document.querySelector('.map__address').textContent = curAddress;
            });
        }

        // input field in form
        let suggestView = new ymaps.SuggestView('address');

        submitButton.events.add("click", () => {
            document.querySelector('#address').value = curAddress;
            document.querySelector('#map').classList.remove('active');
        });

        closeButton.events.add("click", () => {
            document.querySelector('#map').classList.remove('active')
        });
        
        document.querySelector('.ymaps-2-1-77-copyrights-pane').style.display = 'none';
    });
};