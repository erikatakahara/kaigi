const express = require('express'),
	handlebars = require('express-handlebars'),
	config = require('./../config.json'),
	home = require('./controllers/home'),
	login = require('./controllers/login'),
	calendar = require('./controllers/calendar'),
	oauth = require('./controllers/oauth'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	cookieParser = require('cookie-parser'),
	MemcachedStore = require('connect-memjs')(session),
	http = require('http'),
	app = express();

let MEMCACHE_URL = process.env.MEMCACHE_URL || '127.0.0.1:11211';

if (process.env.USE_GAE_MEMCACHE) {
	MEMCACHE_URL = `${process.env.GAE_MEMCACHE_HOST}:${process.env.GAE_MEMCACHE_PORT}`;
}
console.log(MEMCACHE_URL);
// Config
app.enable('trust proxy');
app.engine('html', handlebars.create({defaultLayout: 'base', extname: 'html'}).engine);
app.set('views', 'views/pages');
app.set('view engine', 'html');

var sessionConfig = {
	secret: config.auth_secret_key,
	proxy: true,
	resave: false,
	saveUninitialized: true,
	store: new MemcachedStore({
		servers: [MEMCACHE_URL]
	})
};

app.use(cookieParser());
app.use(bodyParser());
app.use(session(sessionConfig));

//Filter
app.all('/calendar', function(req, resp, next) {
	console.log('filter', req.session.user)
	if(req.session.user) {
		next();
		return;
	}
	resp.redirect('/login');
});

// Routes
app.use('/', express.static('/assets'));
app.use('/', home);
app.use('/calendar', calendar);
app.use('/auth', oauth);
app.use('/login', login);

let listener = app.listen(process.env.PORT || 3000, () => {
	console.log('Starting server at port', listener.address().port);
});