
var InstagramApp = (function(window, document, $) {
	return {
		// The application client id
		client_id: "1780a9ec5baf4cd8b0b934fccd0b3580",

		// Id of the authentication button
		authenticate_btn_id: "instagram_authenticate_btn",

		instagram_auth_url: "https://instagram.com/oauth/authorize/?client_id={{CLIENT-ID}}&redirect_uri={{REDIRECT-URI}}&response_type=token",

		redirect_uri: "http://sane.mooo.com/",

		init: function() {
			var ia = InstagramApp,
				accessToken,
				btn;

			btn = $("#" + ia.authenticate_btn_id);
			console.log(btn);
			btn.on("click", ia.authenticate);
		},

		// Authenticate the current instagram user (if not authenticated already)
		authenticate: function() {
			var ia = InstagramApp,
				url = ia.craft_authentication_url(),
				token;

			token = ia.get_access_token()

			if (token == null)	{	
				window.location = url;
			}
			else {
				return token;
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
			var a = document.createElement("a");
			a.href = window.location;
			console.log(a);
		}

	}
})(window, document, jQuery);