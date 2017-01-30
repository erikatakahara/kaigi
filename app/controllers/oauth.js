const router = require('express').Router(),
	auth = require('./../service/authorization'),
	config = require('./../../config.json');

router.get('/google', (req, resp) => {
	resp.redirect(auth.authUrl());
});

router.get('/google/callback', (req, resp) => {
	auth.authorize(req.query.code).then(user => {
		req.session.user = user;
		resp.redirect('/calendar');
	});
});

module.exports = router;
