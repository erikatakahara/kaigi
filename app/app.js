const express = require('express'),
	handlebars = require('express-handlebars'),
	home = require('./controllers/home'),
	calendar = require('./controllers/calendar'),
	app = express();

// Config
app.engine('html', handlebars.create({defaultLayout: 'base', extname: 'html'}).engine);
app.set('views', 'views/pages');
app.set('view engine', 'html');

// Routes
app.use('/assets', express.static('/assets'));
app.use('/', home);
app.use('/calendar', calendar);

let listener = app.listen(process.env.PORT || 3000, () => {
	console.log('Starting server at port', listener.address().port);
});