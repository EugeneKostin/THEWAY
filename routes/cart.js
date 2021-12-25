var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');

router.get('/', function(req, res, next) {
    if (!req.session.cart) {
        return res.render('cart', { title: 'Корзина', products: '', ifget: true });
    }
    var cart = new Cart(req.session.cart);
    console.log(cart.getItems())
    res.render('cart', { title: 'Корзина', products: cart.getItems(), totalPrice: cart.totalPrice, ifget: true});
});

router.post('/', (req, res) => {
    if (!req.session.cart) {
      return res.render('cart', { title: 'Корзина', products: '', ifget: false });
    }
    //console.log(req.session.cart)
    var cart = new Cart(req.session.cart);
    res.render('cart', { title: 'Корзина', products: cart.getItems(), totalPrice: cart.totalPrice, ifget: false});
  });

// router.get('/add/:id', function(req, res, next) {
//     var productId = req.params.id;
//     var cart = new Cart(req.session.cart ? req.session.cart : {});

//     cart.add(cart.items[productId].item, productId);

//     req.session.cart = cart;
//     res.redirect('/cart');
// });

// router.get('/remove/:id', function(req, res, next) {
//     var productId = req.params.id;
//     var cart = new Cart(req.session.cart ? req.session.cart : {});

//     cart.remove(productId);
//     req.session.cart = cart;
//     res.redirect('/cart');
// });
  
module.exports = router;