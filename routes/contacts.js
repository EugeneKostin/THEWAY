var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.render('contacts', {title: 'Контакты', ifget: true});
});

router.post('/', (req, res) => {
    res.render('contacts', {title: 'Контакты', ifget: false});
});

module.exports = router;