var express = require('express');
var router = express.Router();
var db = require('../firestore/database');
const Cart = require('../models/cart');

let category_arr = [];
(async () => {
  const categories = await db.collection('categories').get();
	categories.forEach((doc) => {
    category_arr.push(doc.data());
  });
  // console.log(category_arr);
  return category_arr;
	
})();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/categories')
});

router.post('/', function(req, res, next) {
  res.redirect('/categories')
});






module.exports = router;
