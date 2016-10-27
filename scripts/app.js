var api_key = "MDplMmI0M2Q5YS01OTEzLTExZTYtYjllYS1iYmZjMGM2YWY2OTc6eXdWcXNzZUF3QmhURmhnQVdEejNqZExoZnlCajBPR0dUUjQ4";

var beer_app = {
	get_beer_id : '',
	beer_product_id : '',

	init: function(){
		// get products
		$.ajax('http://lcboapi.com/products', {
			access_key: api_key, // this is doing nothing ??? 
			method: 'GET',
			dataType: 'jsonp',
			data : {
				q: 'beau\'\s',
				'per_page': '100',
				'where': 'is_seasonal', // 2. ignore Lug Tread
			},
		}).then(beer_app.parse_response).done(function() {
		  // console.log( beer_product_id );
		});


	}, // end init
	
	parse_response: function(response_data) {
		console.log(response_data);
		// store some strings as variables
		var beaus_title = 'Beau\'\s All Natural Brewing',
			lug_head = 'Beau\'\s Lug Tread 10Th Birthday';

		var get_maker = response_data.result;

		// console.log(get_maker);
		var wrap = $('.wrap'),
			wrap__modal = $('.wrap__modal');


		var beer_initial_content = "",
			beer_modal_content = "",
			beer_counter = 0;

		for (var i = 0; i < get_maker.length; i++) {

			if (beer_counter < 6) {
				beer_counter++;
			} else {
				beer_counter = 1;
			}

			// 2. ignore Lug Tread (just in case -- is_seasonal misses something)
			if (get_maker[i].producer_name == beaus_title && get_maker[i].name !== lug_head) {
				
				var maker = get_maker[i];
				
				// 4. get the ID to pass in the other part
				beer_product_id = maker.product_no;
				
				// id + product number are the same
				get_beer_id =  maker.id;

				// 3. get beer description (eliminate null + unndefined)
				beer_title = maker.name !== "" && maker.name !== null ? '<h2 class="text__center">' + maker.name + '</h2><div class="image--extra-small"><img src="images/beer.svg"></div>' : "";

				beer_image = maker.image_url !== "" && maker.image_url !== null ? '<section class="wrap__half"><img src="' + maker.image_url + '" class="image--medium"></section>' : "";

				full_wrapper = '';

				if (maker.image_url !== "" && maker.image_url !== null) {
					full_wrapper = 'wrap__half';
				} else {
					full_wrapper = 'wrap__full';
				}

				beer_maker = maker.producer_name !== undefined && maker.producer_name !== null ? '<h3>' + maker.producer_name + '</h3>' : "";

				beer_desc = maker.style !== null && maker.style !== undefined ? '<h4 class="text__desc">Style: ' + maker.style + '</h4>' : "";

				beer_tasting = maker.tasting_note !== undefined && maker.tasting_note !== null ? '<h4 class="text__desc">' + maker.tasting_note + '</h4>' : "";
				
				beer_serving = maker.beer_serving !== undefined && maker.beer_serving !== null ? '<h4 class="text__desc">beer_serving ' + maker.beer_serving + '</h4>' : "";

				// split string on space + adds p tags
				beer_tags_nice = "";
				// if not empty
				b_string = maker.tags !== undefined && maker.tags != null ? maker.tags : "";
				
				function split_string(b_string, separator) {
				  var array_of_tags = b_string.split(separator);
				  beer_tags_nice = '<div class="span--background-wrap"><h4>Tags: </h4><span>' + array_of_tags.join('</span><span>') + '</span></div>';
				}

				// calls function
				split_string(b_string, ' ');

				beer_price = '<h4 class="text__bold">Price: $' + get_maker[i].price_in_cents / 100  + '</h4>';

				// ID a data attribute
				beer_initial_content += '<div class="unique_id_here wrap__beer wrap__beer-' + beer_counter + ' animated fadeIn " data-beer="'+ beer_product_id +'">' + beer_title  + '</div>';

				beer_modal_content += '<div class="wrap__beer-inner clearfix  animated fadeIn">' + beer_image +  '<section class="'+ full_wrapper +'">' +beer_serving+ beer_maker + beer_price + beer_desc + beer_tasting + beer_tags_nice + '</section><div id="wrap__beer-place" class="wrap__beer-place"></div></div>';
			}

		}
		
		// On click of the start button
		$('.button__start').on('click',function(){
			$(this).unbind();

			// Scroll to correct place
			$('html,body').animate({scrollTop: $('.wrap__inner.flexbox__display-flex').offset().top}, 800);

			wrap.append(beer_initial_content);


			// 4. get map + directions. When a user selects one, they want you to provide a description and also show the stores that carry that particular beer.
			$( ".unique_id_here").on('click',function(){
				// $('.wrap__beer-inner').addClass('hide');
				// $('.map').addClass('hide');
				// $(this).find('.wrap__beer-inner').toggleClass('hide');
				console.log('click');

				wrap__modal.append(beer_modal_content).removeClass('js-modal-hide');


			  get_beer_data = $(this).data('beer');
			  // log the store id on click

			});

			
		});
		

		
	}, // end parse_response

};

// Inner map click
// $(document).on('click', '.map',function(e){
// 	e.preventDefault();

// 	var map_lat = $(this).data('lat'),
// 		map_long = $(this).data('long'),
// 		map_postal = $(this).data('postal'),
// 		place_unique_id = $(this).attr('id'),
// 		been_clicked = $(this).data('clicked');

// 		// console.log(been_clicked);

// 		var initMap = function() {
// 		  var myLatlng = {lat: map_lat, lng: map_long};

// 		  var map = new google.maps.Map(document.getElementById(place_unique_id), {
// 		    zoom: 4,
// 		    center: myLatlng
// 		  });

// 		  var marker = new google.maps.Marker({
// 		    position: myLatlng,
// 		    map: map,
// 		    title: 'Click to zoom'
// 		  });

// 		  marker.addListener('click', function() {
// 		    map.setZoom(8);
// 		    map.setCenter(marker.getPosition());
// 		  });
// 		}

// 		if ( $(this).data('clicked') == false ) {

// 			// TODO: fix this
// 			$(this).attr('data-clicked',true);


// 			// call the map function
// 			initMap();

// 		}

// });

$(document).ready(function(){
	beer_app.init();
});







