const add_btns = document.querySelectorAll('.dish__add');
const remove_btns = document.querySelectorAll('.dish__remove');
const category = window.location.pathname.split('/').pop();
const main_block = document.querySelector('main');


async function fetchMainContent(url) {
    //console.log('start')
    document.querySelector('main').classList.add('loading');
    try {
        let res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        });
        let result = await res.text();
        //console.log(result)
        //console.log('end')
        document.querySelector('main').classList.remove('loading');
        document.querySelector('main').innerHTML = result;
    } catch (e) {
        //console.log(e.message);
        fetchMainContent('/');
    }
};

async function dishControlsEvent(element) {
    let action = element.dataset.action;
    let data = {
        id: element.value
    };
    let res = await fetch('/categories/' + data.id + '/' + action, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
    });
    let result = await res.json();
    if (action == 'add') {
        if (window.location.pathname == '/cart') {
            element.closest('.dish__item_incart').classList.remove('deleted');
            element.closest('.dish__item').querySelector('.dish__price').textContent = result.price;
            document.querySelector('.footer-total__price-value').textContent = result.total;
        } else {
            element.closest('.dish__item').classList.add('active');
        }
        element.parentElement.querySelector('.dish__remove').disabled = false;
        element.parentElement.querySelector('.dish__count').textContent = result.quantity;
        element.parentElement.querySelector('.dish__count').classList.remove('disabled');
        element.parentElement.querySelector('.dish__price').classList.remove('left-moved');
        
    } else if (action == 'remove') {
        if (result.quantity) {
            if (window.location.pathname == '/cart') {
                element.closest('.dish__item').querySelector('.dish__price').textContent = result.price;
                document.querySelector('.footer-total__price-value').textContent = result.total;
            }
            element.parentElement.querySelector('.dish__count').textContent = result.quantity;
        } else if (window.location.pathname == '/cart') {
            element.closest('.dish__item_incart').classList.add('deleted');
            element.parentElement.querySelector('.dish__remove').disabled = true;
            element.closest('.dish__item').querySelector('.dish__price').textContent = result.price;
            element.parentElement.querySelector('.dish__count').textContent = result.quantity;
            document.querySelector('.footer-total__price-value').textContent = result.total;
            //element.parentElement.parentElement.parentElement.remove();
        } else {
            element.parentElement.querySelector('.dish__remove').disabled = true;
            element.parentElement.querySelector('.dish__count').textContent = 0;
            element.parentElement.querySelector('.dish__count').classList.add('disabled');
            element.parentElement.querySelector('.dish__price').classList.add('left-moved');
            element.closest('.dish__item').classList.remove('active');
        }
    } else (console.log('err control'))
};

function dishControlsVisCheck(){
    document.querySelectorAll('.dish__count').forEach((item) => {
        if (item.textContent == 0) {
            item.classList.add('disabled');
            item.parentElement.querySelector('.dish__remove').disabled = true;
            item.parentElement.querySelector('.dish__price').classList.add('left-moved');
            item.closest('.dish__item').classList.remove('active');
        } else { 
            item.classList.remove('disabled');
            item.parentElement.querySelector('.dish__remove').disabled = false;
            item.parentElement.querySelector('.dish__price').classList.remove('left-moved');
            if (window.location.pathname.includes('categories')) {
                item.closest('.dish__item').classList.add('active');
            }
        }
    });
};

function historyPushEvent(element) {
    element.addEventListener('click', (e) => {
        let url = e.currentTarget.dataset.url;
        fetchMainContent(url);
        history.pushState({ prevUrl: location.href}, null, url);
    });
};

function historyBackEvent() {
    document.querySelector("#back_btm").addEventListener('click', () => {
        let url = window.history.state.prevUrl || '/';
        fetchMainContent(url);
        window.history.back();
    });
};

function navEvent(element) {
    element.addEventListener('touchstart', (e) => {
        e.currentTarget.classList.add('touched');
    });
    historyPushEvent(element);
    element.addEventListener('touchend', (e) => {
        e.currentTarget.classList.remove('touched');
    });
};

function showItemDetails(element) {
    data_obj = {
        "title": element.querySelector('.dish__title').textContent,
        "img_src": element.querySelector('img').src,
        "descr": element.querySelector('.dish__descr').textContent,
        "weight": element.querySelector('.dish__weight').textContent,
    }
    let div = document.createElement('div');
    div.className = "dish_popup";
    div.innerHTML = '<div class="dish_popup__overlay"></div><div class="dish_popup__wrapper"><div class="dish_popup__img"><img src="' + data_obj.img_src + '" alt="изображение '+ data_obj.title +'"></div><div class="dish_popup__content"><div class="dish_popup__title">' + data_obj.title + '</div><div class="dish_popup__weight">' + data_obj.weight + '</div><div class="dish_popup__descr">' + data_obj.descr + '</div></div></div>';
    document.querySelector('.dish').append(div);
    let just_timeout_for_transition = div.offsetWidth;
    div.classList.add('active');
    document.querySelector('.dish_popup__overlay').addEventListener('click', (e) => { 
        e.currentTarget.parentElement.classList.remove('active')
        e.currentTarget.parentElement.addEventListener("transitionend", () => div.remove());
    })

    let touch_item = document.querySelector('.dish_popup__wrapper');
    touch_item.addEventListener('touchstart', handleTouchStart, false);
    touch_item.addEventListener('touchmove', handleTouchMove, false);        
    touch_item.addEventListener('touchend', handleTouchEnd, false);

    let startY;
    
    function handleTouchStart(e) {
        let touchobj = e.changedTouches[0];
        startY = touchobj.pageY
    };

    function handleTouchMove(e) {
        e.preventDefault();
        let touchobj = e.changedTouches[0];
        let yDiff = touchobj.pageY - startY;

        if (yDiff > 0) {
            touch_item.style.transform = "translateY(" + yDiff + "px)";
        }
    }
    function handleTouchEnd(e) {
        let touchobj = e.changedTouches[0];
        let yDiff = touchobj.pageY - startY;
        
        if ( yDiff > 150 ) {
            touch_item.removeAttribute("style");
            e.currentTarget.parentElement.classList.remove('active');
            e.currentTarget.parentElement.addEventListener("transitionend", () => div.remove());
        } else {
            touch_item.style.transform = "translateY(0px)";
        }
    }
}

let observer = new MutationObserver( () => {
    document.querySelectorAll(".menu__item, .footer-total__nav-button").forEach((item) => {
        historyPushEvent(item);
    });

    document.querySelectorAll(".bottom-menu__item").forEach((item) => {
        navEvent(item);
    });
    
    //console.log(window.history.state)
    historyBackEvent();

    if (window.location.pathname.includes('categories') || window.location.pathname.includes('cart')) {
        document.querySelectorAll(".dish__remove, .dish__add").forEach((item) => {
            item.addEventListener('click', (e) => {dishControlsEvent(e.currentTarget)})
        });
        dishControlsVisCheck();
    }
    document.querySelectorAll(".bottom-menu__item").forEach((item) => {
        if (window.location.pathname.includes(item.dataset.url)) {
            item.classList.add('active');
        }
    });
    document.querySelectorAll(".dish__img").forEach((item) => {
        item.addEventListener('click', (e) => { showItemDetails(e.currentTarget.parentElement) })
    });

    if (window.location.pathname.includes('contacts')) {
        contactsMap();
    }

    if (window.location.pathname.includes('checkout')) {
        checkoutMap();
        document.querySelector('#card').addEventListener('click', (e) => {
            document.querySelector('.selector__slider').classList.add('toggled');
        });
        document.querySelector('#cash').addEventListener('click', (e) => {
            document.querySelector('.selector__slider').classList.remove('toggled');
        });
    }
    
});
observer.observe(main_block, {childList: true});

window.addEventListener('popstate', () => {
    cur_path = window.location.pathname;
    fetchMainContent(cur_path);
    
});

document.addEventListener("DOMContentLoaded", () => {
    let div = document.createElement('div');
    div.className = "preloader active";
    div.innerHTML = '<div class="preloader__brand">The Way</div><div class="preloader__text-items"><div class="preloader__text-item">дарим</div><div class="preloader__text-item">вкус</div><div class="preloader__text-item">картоху</div></div>';
    document.body.append(div);
    document.body.classList.remove('hidden');
    window.setTimeout( () => {
        div.classList.remove('active');
        div.addEventListener("transitionend", () => {div.remove();}, false);
    }, 2000);

    historyBackEvent();

    document.querySelectorAll(".bottom-menu__item").forEach((item) => {
        navEvent(item);
        if (window.location.pathname.includes(item.dataset.url)) {
            item.classList.add('active');
        }
    });

    document.querySelectorAll(".menu__item, .footer-total__nav-button").forEach((item) => {
        historyPushEvent(item);
    });

    if (window.location.pathname.includes('categories') || window.location.pathname.includes('cart')) {
        document.querySelectorAll(".dish__remove, .dish__add").forEach((item) => {
            item.addEventListener('click', (e) => {dishControlsEvent(e.currentTarget)})
        });
        dishControlsVisCheck();
    }

    document.querySelectorAll(".dish__img").forEach((item) => {
        item.addEventListener('click', (e) => { showItemDetails(e.currentTarget.parentElement) })
    });

    if (window.location.pathname.includes('contacts')) {
        contactsMap();
    }

    if (window.location.pathname.includes('checkout')) {
        checkoutMap();
        document.querySelector('#card').addEventListener('click', (e) => {
            document.querySelector('.selector__slider').classList.add('toggled');
        });
        document.querySelector('#cash').addEventListener('click', (e) => {
            document.querySelector('.selector__slider').classList.remove('toggled');
        });
    }
});


