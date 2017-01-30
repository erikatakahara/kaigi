const google = require('googleapis'),
	googleAuth = require('google-auth-library'),
	config = require('./../../config.json');

const SCOPES = [
	'https://www.googleapis.com/auth/calendar.readonly',
	'https://www.googleapis.com/auth/userinfo.profile',
	'https://www.googleapis.com/auth/userinfo.email'
];

let clientSecret = config.client_secret,
	clientId = config.client_id,
	redirectUrl = config.url + '/auth/google/callback',
	auth = new googleAuth(),
	oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

function authUrl() {
	let authUrl = oauth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES
	});
	return authUrl;	
}

function convertToUser(profile, accessToken) {
	return {
		id: profile.id,
		name: profile.displayName,
		image: profile.image.url,
		accessToken: accessToken
	};
}

function login(client, token) {
	let plus = google.plus('v1');
	plus.people.get({
		userId: 'me',
		auth: client
	}, function (err, response) {
		if(err) {
			console.log('error');
			return;
		}

		let user = convertToUser(response, token.access_token);
		console.log('Sucess login!', user);
		return user;
	});
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
			console.log('Login start');
			var user = login(oauth2Client, token);
			resolve(user);
		});
	});
}

module.exports = {
	authorize: authorize,
	authUrl: authUrl,
	client: oauth2Client
}