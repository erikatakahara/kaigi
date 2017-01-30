let router = require('express').Router();

router.get('/store', (req, res) => {
	res.redirect('/');
});

router.get('/remove', (req, res) => {
	res.redirect('/');
});

module.exports = router;