/* Current position options */
var positionOptions = {
	enableHighAccuracy : true,
	timeout : 10 * 1000
};

/* Map style array object */
var mapStyles = [ {
	stylers : [ {
		hue : "#00ffe6"
	}, {
		saturation : -20
	} ]
}, {
	featureType : "road",
	elementType : "geometry",
	stylers : [ {
		lightness : 100
	}, {
		visibility : "simplified"
	} ]
}, {
	featureType : "road",
	elementType : "labels",
	stylers : [ {
		visibility : "off"
	} ]
} ];

/* Map options */
var mapOptions = {
	zoom : 14,
	disableDefaultUI : true,
	styles : mapStyles
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

/* User location Marker options */
var currentPositionOptions = {
	title : "You are here !",
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
	drawingControl : false
};

/* Variable to hold current location */
var currentLocation = null;
/* Variable to hold map object */
var map = null;
/* Variable to hold marker object */
var currentPositionMarker = null;
/* Variable to hold drawing manager object */
var drawingManager = null;
/* Variable to hold place search service object */
var placeSearchService = null;
/* Variable to hold results info window */
var infoWindow = null;
/* Variable to hold circle object resizing */
var circle = null;
/* Variable to hold search results */
var searchPlaceResults = null;
/* Variable to hold search result markers */
var searchPlaceResultMarkers = {};
/* Variable to hold previous circle radius */
var radius = 0;

/* Function to initialize maps */
$(document).ready(function() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(processIntialMap, null, positionOptions);
	} else {
		error('Your browser do not support this application. Please update !');
	}
});

/* Function to process map */
function processIntialMap(position) {
	currentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	drawingManager = new google.maps.drawing.DrawingManager(initalDrawingManagerOptions);
	// Create map object
	map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
	// Set center of map to user current location.
	map.setCenter(currentLocation);
	currentPositionMarker = new google.maps.Marker(currentPositionOptions);
	currentPositionMarker.setPosition(currentLocation);
	// Set marker to map
	currentPositionMarker.setMap(map);
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
		map.panTo(currentPositionMarker.getPosition());
	}, 2500);
};

/* Method to process event after circle is drawn */
function processCircleComplete(completedcircle) {
	circle = completedcircle;
	radius = completedcircle.getRadius();
	circle.setCenter(currentLocation);
	google.maps.event.addListener(circle, 'radius_changed', processCircleResize);
	drawingManager.setOptions(afterDrawingManagerOptions);
	searchPlaces(circle.getRadius());
};

/* Method for processing circle resized */
function processCircleResize() {
	if (circle.getRadius() > radius) {
		searchPlaces(circle.getRadius());
	} else {
		removeSearchResultMarker();
	}
	radius = circle.getRadius();
};

/* Function to search places */
function searchPlaces(circleRadius) {
	/* Place search request object */
	var placeSearchRequest = {
		location : currentLocation,
		radius : circleRadius
	};
	placeSearchService = new google.maps.places.PlacesService(map);
	placeSearchService.nearbySearch(placeSearchRequest, processSearchResponses);
};

/* Process results */
function processSearchResponses(places, status) {
	searchPlaceResults = places;
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		for (var i = 0; i < places.length; i++) {
			var distance = google.maps.geometry.spherical.computeDistanceBetween(currentLocation, searchPlaceResults[i].geometry.location);
			if (distance < circle.getRadius()) {
				addSearchResultMarker(places[i]);
			}
		}
	}
};

/* Create marker and add them on the map */
function addSearchResultMarker(place) {
	var searchPlaceMarker = new google.maps.Marker({
		map : map,
		position : place.geometry.location,
		icon : 'http://maps.google.com/mapfiles/marker_blackA.png'

	// animation : google.maps.Animation.DROP
	});
	searchPlaceResultMarkers[place.place_id] = searchPlaceMarker;
	infowindow = new google.maps.InfoWindow();
	google.maps.event.addListener(searchPlaceMarker, 'click', function() {
		infowindow.setContent(place.name);
		infowindow.open(map, this);
	});
};

/* Remove marker and add them on the map */
function removeSearchResultMarker() {
	for ( var place_id in searchPlaceResultMarkers) {
		var distance = google.maps.geometry.spherical.computeDistanceBetween(circle.getCenter(), searchPlaceResultMarkers[place_id].getPosition());
		if (distance - circle.getRadius() >= -10) {
			searchPlaceResultMarkers[place_id].setMap(null);
			delete searchPlaceResultMarkers[place_id];
		}
	}
};
