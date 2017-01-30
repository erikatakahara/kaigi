let router = require('express').Router(),
	calendar = require('../service/calendar'),
	auth = require('../service/authorization');

router.get('/', (req, resp) => {
	calendar.todayEvents().then(events => {
		console.log(JSON.stringify(events));
		resp.render('calendar/list', events);
	}).catch(err => {
		resp.redirect(auth.authUrl());
	});
});

router.get('/auth/callback', (req, resp) => {
	auth.authorize(req.query.code).then(googleAuth => {
		oauth = googleAuth;
		resp.redirect('/calendar');
	});
});

module.exports = router;