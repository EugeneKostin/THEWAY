const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session')
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const favicon = require('serve-favicon')

const indexRouter = require('./routes/index');
const dishesRouter = require('./routes/dishes');
const cartRouter = require('./routes/cart');
const checkoutRouter = require('./routes/checkout');
const contactsRouter = require('./routes/contacts');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(''));
app.use(sassMiddleware({
	src: path.join(__dirname, 'public'),
	dest: path.join(__dirname, 'public'),
	indentedSyntax: false, // true = .sass and false = .scss
	outputStyle: 'compressed',
	sourceMap: true
}));
app.set('trust proxy', 1)
app.use(cookieSession({
	name: 'session',
	secret: 'ZUOYz59jqB',
	maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }))
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));

// routes

app.use('/', indexRouter);
app.use('/categories', dishesRouter);
app.use('/cart', cartRouter);
app.use('/checkout', checkoutRouter);
app.use('/contacts', contactsRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
