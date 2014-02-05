
var InstagramApp = (function(window, document, $) {
	return {
		// The application client id
		client_id: "1780a9ec5baf4cd8b0b934fccd0b3580",

		redirect_uri: "http://sane.mooo.com/instagram-test/client-only/src/",

		instagram_auth_url: "https://instagram.com/oauth/authorize/?client_id={{CLIENT-ID}}&redirect_uri={{REDIRECT-URI}}&response_type=token",

		// Id of the authentication button
		authenticate_btn_id: "instagram_get_btn",

		init: function() {
			var ia = InstagramApp,
				accessToken,
				btn;

			btn = $("#" + ia.authenticate_btn_id);

			btn.on("click", ia.get_images);
		},

		// Authenticate the current instagram user (if not authenticated already)
		get_images: function() {
			var ia = InstagramApp,
				auth_url = ia.craft_authentication_url(),
				token;

			token = ia.get_access_token();

			if (token == null)	{	
				// need to authenticate first!
				window.location = auth_url;
			}
			else {
				// Fetch the images here

			}

		},

		// 
		craft_authentication_url: function() {
			var ia = InstagramApp,
				url = ia.instagram_auth_url;

			url = url.replace("{{CLIENT-ID}}", ia.client_id);
			url = url.replace("{{REDIRECT-URI}}", ia.redirect_uri);

			return url;
		},

		get_access_token: function() {
			var a = document.createElement("a"),
					token;

			// Parsing the current url to check if the access token already exists
			a.href = window.location;
			console.log(a.hash);
			// Removing the hash
			token = a.hash.substr();
			token = token.split('=');

			if (token.length == 2) {
				if (token[0] == 'access_token') {
					return token[1];
				}
				else {
					return null;
				}
			}
			else {
				return null
			}
		}

	}
})(window, document, jQuery);