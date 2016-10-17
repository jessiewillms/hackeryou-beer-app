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
		var wrap = $('.wrap');

		var beer = "";

		for (var i = 0; i < get_maker.length; i++) {

			// 2. ignore Lug Tread (just in case -- is_seasonal misses something)
			if (get_maker[i].producer_name == beaus_title && get_maker[i].name !== lug_head) {
				
				var maker = get_maker[i];
				// 4. get the ID to pass in the other part
				beer_product_id = maker.product_no;
				// console.log('product_no ' + beer_product_id);
				
				// id + product number are the same
				get_beer_id =  maker.id;

				// 3. get beer description (eliminate null + unndefined)
				beer_title = maker.name !== "" && maker.name !== null ? '<h2 class="text__center">' + maker.name + ' <img src="images/arrow.svg" class="image--extra-small">' + '</h2>' : "";

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

				// jordan suggested making the ID a data attribute
				beer += '<div class="wrap__beer animated fadeIn" data-beer="'+ beer_product_id +'">' + beer_title  + '<div class="wrap__beer-inner clearfix hide animated fadeIn">' + beer_image +  '<section class="'+full_wrapper+'">' +  beer_maker + beer_price + beer_desc + beer_tasting + beer_tags_nice + '</section>' + '</div>' + 
				beer_serving  + '<div id="wrap__beer-place" class="wrap__beer-place"></div></div>';
			}

		}
		
		// this should go somewhere else??
		$('.button__start').on('click',function(){
			$(this).unbind();

			wrap.append(beer);

			// 4. get map + directions. When a user selects one, they want you to provide a description and also show the stores that carry that particular beer.
			$( ".wrap__beer" ).on('click',function(){

				// $(this).unbind();
				
				$('.wrap__beer-inner').addClass('hide');
				$('.map').addClass('hide');
			  
			  	
			  	$(this).find('.wrap__beer-inner').toggleClass('hide');

			  get_beer_data = $(this).data('beer');
			  // log the store id on click

			  // another request to get store data for product id
			  $.ajax('http://lcboapi.com/stores?product_id=' + get_beer_data, {
			  	access_key: api_key, // this is doing nothing ??? 
			  	method: 'GET',
			  	dataType: 'jsonp',
			  	success: function(location_response) {
			  		// console.log(location_response);

			  		var store_info = "",
			  			counter = 0; // for limitng addresses

			  		for (var i = 0; i < location_response.result.length; i++) {
			  			counter++; // counter is for limitng addresses
			  			// console.log('counter',counter);

			  			var place = location_response.result[i];

			  			// geo data for map
			  			place_lat = place.latitude !== "" && place.latitude !== null ? place.latitude : "";
			  			place_long = place.longitude !== "" && place.longitude !== null ? place.longitude : "";
			  			
			  			// console.log(place_long, place_lat);
			  			
			  			// postal code
			  			place_postal = place.postal_code !== "" && place.postal_code !== null ? place.postal_code : "";
			  			// console.log(place_postal);

			  			place_address_line_1 = place.address_line_1 !== "" && place.address_line_1 !== null ? '<div class="span--background-wrap"><span>' + place.address_line_1 + '</span><img src="images/map.svg" class="image--mid-small"></div>' : "";
			  			
			  			place_address_line_2 = place.address_line_2 !== "" && place.address_line_2 !== null ? place.address_line_2 : "";

			  			place_store_id = place.id != "" && place.id !== null ? place.id : "";
			  			// console.log(place_unique_id);

			  			if (counter <= 6) {
			  				place_names = place.name !== null ? '<h3>' + place.name + '</h3>' : "";
			  				address = '<div class="map" data-lat="' + place_lat + '" data-long="' + place_long + '" data-postal="' + place_postal + '" data-id="' + place_postal + '" id="id_' + place_store_id + '" data-clicked="false">' + place_names + place_address_line_1 + '</div>';
			  			} else {
			  				address = "",
			  				place_names = "";
			  			}
			  			// console.log(place_address_line_2);
			  			store_info +=  address;

			  			// city
			  			place_city = place.city !== "" && place.city !== null ? place.city : "";
			  			// console.log(place_city);

			  			// tasting bar 
			  			place_bar = place.has_tasting_bar !== "" && place.has_tasting_bar !== null ? place.has_tasting_bar : "";
			  			// console.log(place_bar);

			  			// quantity
			  			place = place.quantity !== "" && place.quantity !== null && place.quantity !== undefined ? place.quantity : "";
			  			// cosnsole.log(place);
			  		}

			  		// console.log(store_info);

			  		$("[data-beer='" + get_beer_data + "']").find('.wrap__beer-place').html(store_info);
			  		
			  		// call the function that will add the location information as a data-attribute of location. when you click on the .wrap_beer, check if the data-attribute exists
			  	}
			  });

			});
		});

		
	}, // end parse_response

};

$(document).on('click', '.map',function(e){
	e.preventDefault();

	var map_lat = $(this).data('lat'),
		map_long = $(this).data('long'),
		map_postal = $(this).data('postal'),
		place_unique_id = $(this).attr('id'),
		been_clicked = $(this).data('clicked');

		// console.log(been_clicked);

		var initMap = function() {
		  var myLatlng = {lat: map_lat, lng: map_long};

		  var map = new google.maps.Map(document.getElementById(place_unique_id), {
		    zoom: 4,
		    center: myLatlng
		  });

		  var marker = new google.maps.Marker({
		    position: myLatlng,
		    map: map,
		    title: 'Click to zoom'
		  });

		  marker.addListener('click', function() {
		    map.setZoom(8);
		    map.setCenter(marker.getPosition());
		  });
		}

		if ( $(this).data('clicked') == false ) {

			// this isn't working
			$(this).attr('data-clicked',true);
			// remove the id b/c ids repeat
			// $(this).attr('id','clicked');


			// call the map function
			initMap();

		} else {
			console.log('already been clicked');
		}

});

$(document).ready(function(){
	beer_app.init();
});







