const google = require('googleapis'),
	auth = require('../service/authorization');

google.options({
  auth: auth.client
});

function tomorrow(now) {
	let tomorrow = new Date();
	tomorrow.setDate(now.getDate() + 1);
	tomorrow.setHours(0);
	tomorrow.setMinutes(0);
	tomorrow.setMilliseconds(0);
	return tomorrow;
}

function todayEvents() {
	let now = new Date();

	return new Promise((resolve, reject) => {
 		let calendar = google.calendar('v3');
		calendar.events.list({
			calendarId: 'primary',
			timeMin: now.toISOString(),
			timeMax: tomorrow(now).toISOString(),
			maxResults: 20,
			singleEvents: true,
			orderBy: 'startTime'
		}, function(err, response) {
			if (err) {
				reject(err);
				return;
			}
			resolve(response.items);
		});
	});
}

function watch() {
	let now = new Date();

	return new Promise((resolve, reject) => {
 		let calendar = google.calendar('v3');
		calendar.events.watch({
			id: 1,
			token: 'optional-token',
			type: 'web_hook',
			maxResults: 20,
			singleEvents: true,
			orderBy: 'startTime'
		}, function(err, response) {
			if (err) {
				reject(err);
				return;
			}
			resolve(response.items);
		});
	});
}

module.exports = {
	todayEvents: todayEvents
};