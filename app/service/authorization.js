const credentials = require('./../../client_secret.json'),
	google = require('googleapis'),
	googleAuth = require('google-auth-library');

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

let clientSecret = credentials.installed.client_secret,
	clientId = credentials.installed.client_id,
	//redirectUrl = credentials.installed.redirect_uris[0],
	redirectUrl = 'http://localhost:3000/calendar/auth/callback',
	auth = new googleAuth(),
	oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

function authUrl() {
	let authUrl = oauth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES
	});
	return authUrl;	
}

function authorize(code) {
	return new Promise((resolve, reject) => {	
		oauth2Client.getToken(code, function(err, token) {
			if (err) {
				console.log('Error while trying to retrieve access token', err);
				reject(err);
				return;
			}
			oauth2Client.setCredentials(token);
			resolve(oauth2Client);
		});
	});
}

module.exports = {
	authorize: authorize,
	authUrl: authUrl,
	client: oauth2Client
}