const express = require('express');
const router = express.Router();
const db = require('../firestore/database');
const Cart = require('../models/cart');
let dishes_arr = [];

async function GetDBCategories() {
    let categories = await db.collection('categories').get();
    let category_arr = [];
	categories.forEach((doc) => {
        category_arr.push(doc.data());
    });
    return category_arr;
	
};
async function GetDBCatTitle(req) {
    const cat_data = await db.collection('categories').doc(req.params.slug).get();
    return cat_data.data().title;
}
async function GetDBDishes(req) {
    const categories = db.collection('categories').doc(req.params.slug);
    const dishes = await categories.collection('dishes').get();
    let cart = new Cart(req.session.cart ? req.session.cart : {});
    let dishes_arr = [];
    dishes.forEach( (doc) => {
        let data_obj = doc.data();
        data_obj.id = doc.id;
        data_obj.quantity = cart.items[doc.id] ? cart.items[doc.id].quantity : 0;
        dishes_arr.push(data_obj);
    });
    return dishes_arr;
}

router.get('/', async (req, res) => {
    let category_arr = await GetDBCategories();
    res.render('categories', { title:'Меню', category_arr, ifget: true });
});

router.post('/', async (req, res) => {
    let category_arr = await GetDBCategories();
    res.render('categories', { title:'Меню', category_arr, ifget: false});
});

router.get('/:slug', async (req, res) => {
    let cat_title = await GetDBCatTitle(req);
    dishes_arr = await GetDBDishes(req);
    res.render('dishes', { title: cat_title, dishes_arr, ifget: true});
});

router.post('/:slug', async (req, res) => {  
    let cat_title = await GetDBCatTitle(req);
    dishes_arr = await GetDBDishes(req);
    res.render('dishes', { title: cat_title, dishes_arr, ifget: false});
});

router.post('/:id/add', (req, res) => {
    if(!req.body) return res.sendStatus(400);
    let productId = req.body.id;
    let cart = new Cart(req.session.cart ? req.session.cart : {});
    let product = dishes_arr.filter( (item) => {
        return item.id == productId;
    });
    cart.add(product[0], productId);
    req.session.cart = cart;
    let quantity = cart.items[productId].quantity;
    let price = req.session.cart.items[productId].price;
    let total = req.session.cart.totalPrice;
    res.json({quantity, price, total});
});

router.post('/:id/remove', (req, res) => {
    if(!req.body) return res.sendStatus(400);
    let productId = req.body.id;
    let cart = new Cart(req.session.cart);
    cart.remove(productId);
    req.session.cart = cart;
    let total = req.session.cart.totalPrice;
    try {
        let quantity = req.session.cart.items[productId].quantity;
        let price = req.session.cart.items[productId].price;
        res.json({quantity, price, total});
    } catch (e) {
        console.log('dishes.js remove => ' + e.message);
        res.json({total});
    }
});

module.exports = router;