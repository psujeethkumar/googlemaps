/* Function to initialize maps */
$(document).ready(function() {

	// Check if your device supports geo-locations
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			// Calculate the current location
			var currentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

			// Create map options object
			var mapOptions = {
				zoom : 14,
				center : currentLocation
			};

			// Create drawing manager options
			var drawingManagerOptions = {
				drawingMode : google.maps.drawing.OverlayType.CIRCLE,
				drawingControl : true,
				drawingControlOptions : {
					position : google.maps.ControlPosition.TOP_CENTER,
					drawingModes : [ google.maps.drawing.OverlayType.CIRCLE, google.maps.drawing.OverlayType.RECTANGLE ]
				},
				circleOptions : {
					center : currentLocation,
					draggable : false,
					editable : true,
					fillOpacity : 0.1,
					fillColor : "green",
					strokeColor : "red"
				}

			};
			var drawingManager = new google.maps.drawing.DrawingManager(drawingManagerOptions);

			// Create map object
			var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

			map.setCenter(currentLocation);
			var marker = new google.maps.Marker({
				position : currentLocation,
				title : "I am here !",
				animation : google.maps.Animation.BOUNCE,
			});
			marker.setMap(map);
			drawingManager.setMap(map);

			// Listener for listening events when center changed
			google.maps.event.addListener(map, 'center_changed', function() {
				window.setTimeout(function() {
					map.panTo(marker.getPosition());
				}, 2000);
			});

			// Listener for listening when circle is drawn
			google.maps.event.addListener(drawingManager, 'circlecomplete', function(circle) {
				circle.setCenter(currentLocation);
				drawingManager.setOptions({
					drawingControl : false,
					drawingMode : null
				});
			});

		});
	} else {
		error('Your browser do not support this application. Please update !');
	}
});
