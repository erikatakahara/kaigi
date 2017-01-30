const router = require('express').Router();

router.get('/', (req, res) => {
	console.log('login' + JSON.stringify(req.session.user));
	res.render('login');
});

module.exports = router;
