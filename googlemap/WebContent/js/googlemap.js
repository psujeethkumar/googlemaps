/* Current position options */
var positionOptions = {
	enableHighAccuracy : true,
	timeout : 10 * 1000
};

/* Map options */
var mapOptions = {
	zoom : 14,
};

/* Drawing control options */
var drawingControlOptions = {
	position : google.maps.ControlPosition.TOP_CENTER,
	// drawingModes : [ google.maps.drawing.OverlayType.CIRCLE,
	// google.maps.drawing.OverlayType.POLYGON,
	// google.maps.drawing.OverlayType.POLYLINE,
	// google.maps.drawing.OverlayType.RECTANGLE ]
	drawingModes : [ google.maps.drawing.OverlayType.CIRCLE ]
};

/* Circle Options */
var circleOptions = {
	draggable : false,
	editable : true,
	fillOpacity : 0.1,
	fillColor : "green",
	strokeColor : "red"
};

/* Polygon Options */
var polygonOptions = {
	draggable : false,
	editable : true,
	fillOpacity : 0.1,
	fillColor : "green",
	strokeColor : "red"
};

/* Polygon Line Options */
var polygonLineOptions = {
	draggable : false,
	editable : true,
	fillOpacity : 0.1,
	fillColor : "green",
	strokeColor : "red"
};

/* Rectangle Options */
var rectangleOptions = {
	draggable : false,
	editable : true,
	fillOpacity : 0.1,
	fillColor : "green",
	strokeColor : "red"
};

/* Marker options */
var markerOptions = {
	title : "I am here !",
	animation : google.maps.Animation.BOUNCE
};

/* Drawing manager options */
var initalDrawingManagerOptions = {
	drawingControl : true,
	drawingControlOptions : drawingControlOptions,
	circleOptions : circleOptions,
	polygonOptions : polygonOptions,
	polygonLineOptions : polygonLineOptions,
	rectangleOptions : rectangleOptions
};

/* Drawing manager options after drawing */
var afterDrawingManagerOptions = {
	drawingMode : null,
	drawingControl : false,
};

/* Function to initialize maps */
$(document).ready(function() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(processIntialMap);
	} else {
		error('Your browser do not support this application. Please update !');
	}
});

/* Variable to hold current location */
var currentLocation = null;
/* Variable to hold map object */
var map = null;
/* Variable to hold marker object */
var marker = null;
/* Variable to hold drawing manager object */
var drawingManager = null;

/* Function to process map */
function processIntialMap(position) {
	currentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	drawingManager = new google.maps.drawing.DrawingManager(initalDrawingManagerOptions);
	// Create map object
	map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
	// Set center of map to user current location.
	map.setCenter(currentLocation);
	marker = new google.maps.Marker(markerOptions);
	marker.setPosition(currentLocation);
	// Set marker to map
	marker.setMap(map);
	// Add drawing controls to map
	drawingManager.setMap(map);
	// Listener for listening events when center changed
	google.maps.event.addListener(map, 'center_changed', processMapChangedEvent);
	// Listener for listening when circle is drawn
	google.maps.event.addListener(drawingManager, 'circlecomplete', processCircleComplete);
};

/* Method for processing set map center as current location */
function processMapChangedEvent() {
	window.setTimeout(function() {
		map.panTo(marker.getPosition());
	}, 2000);
};

/* Method to process event after circle is drawn */
function processCircleComplete(circle) {
	circle.setCenter(currentLocation);
	drawingManager.setOptions(afterDrawingManagerOptions);
};
