
var InstagramApp = (function(window, document, $) {
	return {
		// The application client id
		client_id: "1780a9ec5baf4cd8b0b934fccd0b3580",

		redirect_uri: "http://sane.mooo.com/instagram-test/client-only/src/",
		media_url: "https://api.instagram.com/v1/users/self/media/recent/?access_token={{ACCESS-TOKEN}}",

		instagram_auth_url: "https://instagram.com/oauth/authorize/?client_id={{CLIENT-ID}}&redirect_uri={{REDIRECT-URI}}&response_type=token",

		// DOM stuff
		// Id of the authentication button
		authenticate_btn_id: "instagram_get_btn",
		images_div_id: "photos",

		init: function() {
			var ia = InstagramApp,
				accessToken,
				btn;

			btn = $("#" + ia.authenticate_btn_id);

			btn.on("click", function() {
				token = ia.check_access_token();
				if (token != null) {
					ia.append_images(token, ia.images_div_id)
				}
			});
		},

		// Authenticate the current instagram user (if not authenticated already). Then return the access token from url
		check_access_token: function() {
			var ia = InstagramApp,
				auth_url = ia.craft_authentication_url(),
				token;

			token = ia.get_access_token();

			if (token == null)	{	
				// need to authenticate first!
				window.location = auth_url;
			}
			else {
				// return the token
				return token;
			}

		},

		// 
		append_images: function(token, images_div_id) {
			var ia = InstagramApp,
				media_url = ia.media_url;
			
			media_url = media_url.replace('{{ACCESS-TOKEN}}', token);

			$.ajax({
				url: media_url,
				type: 'GET',
				success: function(data) {
					console.log(data)
					JSON.parse(data);
				},
				error: function (respose) {
					alert('oops! something went wrong while requesting your images');
				}

			})
		},

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