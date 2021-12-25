const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const db = require('../firestore/database');
const delivery_price = 200;

router.get('/', (req, res) => {
    if (req.session.cart == null || Object.keys(req.session.cart.items).length === 0) {
        return res.redirect('cart');
    }
    let cart = new Cart(req.session.cart);
    let cart_total = cart.totalPrice;

    res.render('checkout', { title: 'Оформление заказа', cart_total, delivery_price, ifget: true });
});
router.post('/', (req, res) => {
    if (req.session.cart == null || Object.keys(req.session.cart.items).length === 0) {
        return res.redirect('cart');
    }
    let cart = new Cart(req.session.cart);
    let cart_total = cart.totalPrice;

    res.render('checkout', { title: 'Оформление заказа', cart_total, delivery_price, ifget: false });
});

router.post('/form', async (req, res) => {
    const order_data = JSON.parse(JSON.stringify(req.body))
    //console.log(order_data)
    // if (order_data.is_card) {
    //     console.log(order_data.is_card)
    // } else {
    //     console.log('none')
    // }
    const order_db_doc =  db.collection('orders').doc();
    order_data['Время заказа'] = Date().toString();
    order_data['Сумма заказа'] = req.session.cart.totalPrice + delivery_price;

    const order_set = await order_db_doc.set(order_data);
    
    for (let objectKey in Object.keys(req.session.cart.items)) {
        let items_obj = Object.values(req.session.cart.items)[objectKey];
        let item_data = {
            title: items_obj.item.title,
            price: items_obj.item.price,
            quantity: items_obj.quantity,
            total_price: items_obj.price
        }
        const order_items = await order_db_doc.collection('items').doc(Object.keys(req.session.cart.items)[objectKey]).set(item_data);
    }
    req.session.cart = null;
    res.render('success', { title: 'Оформление заказа'});
    
 });

module.exports = router;