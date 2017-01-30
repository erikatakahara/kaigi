let router = require('express').Router(),
	calendar = require('../service/calendar'),
	auth = require('../service/authorization');

router.get('/', (req, resp) => {
	console.log('Calendar' + JSON.stringify(req.session.user));
	calendar.todayEvents().then(events => {
		resp.render('calendar/list', events);
	}).catch(err => {
		console.log(err);
	});
});

router.get('/watch/callback', (req, resp) => {
	console.log('Result', req);
	res.end('It worked!');
});


router.get('/watch', (req, resp) => {
	calendar.watch().then(response => {
		console.log('Watch', response);
		res.end('It worked!');
	}).then(err => {
		console.log('Watch Error', err);
		res.end('It not worked!');
	})
});
module.exports = router;