
var InstagramApp = (function(window, document, $) {
	return {

		// **Instagram data
		// The application client id
		client_id: "1780a9ec5baf4cd8b0b934fccd0b3580",
		redirect_uri: "http://sane.mooo.com/instagram-test/client-only/src/",
		media_url: "https://api.instagram.com/v1/users/self/media/recent/?access_token={{ACCESS-TOKEN}}",
		instagram_auth_url: "https://instagram.com/oauth/authorize/?client_id={{CLIENT-ID}}&redirect_uri={{REDIRECT-URI}}&response_type=token",

		// **DOM stuff
		// Id of the authentication button
		authenticate_btn_id: "instagram_get_btn",
		images_div_id: "photos",
		seemore_div_id: "seemore",

		// **Keeping track of the number of images appended
		current_offset_count: 0,
		append_at_a_time: 20,

		images_data: [],

		init: function() {
			var ia = InstagramApp,
				token,
				accessToken,
				getpics_btn,
				seemore_btn;

			getpics_btn = $("#" + ia.authenticate_btn_id);
			seemore_btn = $('#' + ia.seemore_div_id);
			// Event listener

			token = ia.get_access_token();
			if (token == null) {
				getpics_btn.html("Authenticate first"); 
			}

			seemore_btn.on("click", function() {
				ia.append_images(ia.images_data, ia.images_div_id, ia.append_at_a_time, ia.current_offset_count);
				ia.current_offset_count = ia.current_offset_count + ia.append_at_a_time;

				if (ia.current_offset_count >= ia.append_at_a_time) {
					$(this).attr({disabled: "disabled"});
				}
			});

			getpics_btn.on("click", function() {
				token = ia.check_access_token();
				if (token != null) {
					ia.get_images(token, function(images) {
						images = ia.sort_image_data(images, "descending");
						$('#' + ia.images_div_id).empty();
						ia.append_images(images, ia.images_div_id, ia.append_at_a_time, ia.current_offset_count);
						ia.current_offset_count = ia.current_offset_count + ia.append_at_a_time;
						ia.images_data = images;
						// Enable the button
						$(seemore_btn).removeAttr("disabled");
						$(getpics_btn).attr({disabled: "disabled"});
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
		get_images: function(token, callback) {
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
					callback(imagesData);
				},
				error: function (response, textStatus, errorThrown) {
					alert('oops! something went wrong while requesting your images');
					console.log(textStatus);
					console.log(errorThrown);
				}

			});
		},

		append_images: function(metadata, divId, count, offset) {
			// Default values
			var i,
				img,
				a;

			count = count === undefined ? 20 : count;
			offset = offset === undefined ? 0 : offset;

			for (i=offset;i<(offset+count);i++) {
				a = document.createElement("a");
				img = document.createElement("img");
				img.src = metadata[i].thumbnail;
				img.alt = "Instagram image";
				img.title = "Number of likes: " + metadata[i].likes_count;
				a.href = metadata[i].standard_res;
				$(a).append(img);
				console.log(a);
				$('#' + divId).append(a);
			}
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
					return b.likes_count - a.likes_count;
				})
			}
			else {
				return data.sort(function(a, b) {
					return a.likes_count - b.likes_count;
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


		// Fetch the access token from the url 
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