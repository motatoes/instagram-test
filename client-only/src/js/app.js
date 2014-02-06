
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
					ia.get_images(token, function(images) {
						console.log(images);
						images = ia.sort_image_data(images);
						console.log(images);
					});
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
		get_images: function(token, images_div_id) {
			var ia = InstagramApp,
				media_url = ia.media_url;
			
			media_url = media_url.replace('{{ACCESS-TOKEN}}', token);

			$.ajax({
				url: media_url,
				jsonp: "callback",
				dataType: "jsonp",
				contentType: "application/json", 
				success: function(response) {
					var imagesData = ia.filter_instagram_response(response);
					)
					console.log(imagesData);
				},
				error: function (response, textStatus, errorThrown) {
					alert('oops! something went wrong while requesting your images');
					console.log(textStatus);
					console.log(errorThrown);
				}

			});
		},

		filter_instagram_response: function (response) {
			var mediaData = response.data;
			// Will hold links to all the images, and the number of likes
			var imagesData = [];
			var type;
			var tmp;

			for (i in mediaData) {
				tmp = mediaData[i];
				type = tmp.type;
				if (type == 'image') {
					imagesData.push({
										thumbnail: tmp.images.thumbnail.url,
										standard_res: tmp.images.standard_resolution.url,
										likes_count: tmp.likes.count
									});
				}
			}

			return imagesData

		},

		sort_image_data: function(data, order) {

			if (order === undefined || order === "descending") {
				return data.sort(function(a, b) {
					return b.likes_count - a.likes_count
				})
			}
			else {
				return data.sort(function(a, b) {
					return a.likes_count - b.likes_count
				})
			}
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
			// Removing the hash (first character)
			token = a.hash.substr(1);
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