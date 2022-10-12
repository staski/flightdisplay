import fastXmlParser from 'fast-xml-parser'
//import { Loader } from 'google-maps';
export { parseGpxFile }

//var gloptions = {'libraries': ["geometry", "drawing"]}
//let gloader = new Loader('AIzaSyBYb80Mm61u6J8Cjtt82nJQ0H2AW4zp03g', gloptions);
//const google = await gloader.load();

function latLngToDec(lat1, lat2, lat3) {
    return lat1 + lat2/60 + lat3 / 3600;
}

const K_factor = (2 * 3.14 * 18.52) / ( 36 * 9.81);

function CLocTime(a,b,c,d,e,f,g){
    this.LatLng = a;
    this.altitude = b;
    this.time = c;
    this.vel = d;
    this.velFromDist = e;
    this.heading = f;
    this.feetPerMinute= g;
}

CLocTime.prototype.log = function () {

    var myLog = "Time: " + new Date(this.time) + " ; ";
    myLog += "Heading: " + this.heading.toFixed() + " °; ";
    myLog += "GS: " + this.vel.toFixed() + " kts; ";
    myLog += "Altitude: " + this.altitude.toFixed() + " ft; ";
    myLog += "Climbrate: " + this.feetPerMinute.toFixed() + " ft/min";

    return myLog;
}

function parseGpxFile(xmlString) {
    var pts = [];
    
    const options = {
        ignoreAttributes : false
    };
    var parser = new fastXmlParser.XMLParser(options);
    
    const jsObj = parser.parse(xmlString);
    
    let trackpoints = jsObj.gpx.trk.trkseg.trkpt;

    var lon = parseFloat(trackpoints[0]['@_lon']);
    var lat = parseFloat(trackpoints[0]['@_lat']);
    var mtime = Date.parse(trackpoints[0].time);
    var lasttime = mtime
    var clatlng = new google.maps.LatLng(lat, lon);

    var firsttime = mtime;
    
    pts.push(clatlng);

    for (let i=0;i< trackpoints.length; i++){
       
        mtime = Date.parse(trackpoints[i].time);
        if (mtime - lasttime < 1000*300) {
            continue;
        }
        lon = parseFloat(trackpoints[i]['@_lon']);
        lat = parseFloat(trackpoints[i]['@_lat']);

        clatlng = new google.maps.LatLng(lat, lon);
        
        //console.log(clatlng.lat(), clatlng.lng(), time, trackpoints[i]['@_lat'], lat)
        pts.push(clatlng);
        lasttime = mtime;
    }
    lon = parseFloat(trackpoints[trackpoints.length-1]['@_lon']);
    lat = parseFloat(trackpoints[trackpoints.length-1]['@_lat']);
    var clatlng = new google.maps.LatLng(lat, lon);

    pts.push(clatlng);
    
    const obj = {
        takeoffTime: firsttime,
        coords: pts
    }
    return obj;
}

GPXParser.prototype.getpoints = function () {
    return pts;
}

function GPXParser(xmlFile)
{
    var reader  = new FileReader();
    reader.readAsText(thisFile);
    reader.onloadend = function() {
        this.xmlDoc = parseString(reader.result);
        this.mintrackpointdelta = 0.0001;
        this.pts = [];
    }
}

GPXParser.prototype.addTrackpoints = function() {

    console.log(this)
    var tracks = this.xmlDoc.documentElement.getElementsByTagName("trk");
    for(var i = 0; i < tracks.length; i++) {
        this.addTrack(tracks[i]);
    }
}

GPXParser.prototype.addTrack = function(track) {
    var segments = track.getElementsByTagName("trkseg");
    var name = track.getElementsByTagName("name");
    for(var i = 0; i < segments.length; i++) {
        var segmentlatlngbounds = this.addTrackSegment(segments[i]);
    }
}

GPXParser.prototype.addTrackSegment = function(trackSegment)
{

    var lon, lat; 
    var altitude, lastaltitude;
    var speed; 
    var time = 0, oldtime = 0;
    var feetPerMinute = 0, lastFeetPerMinute = 0;
    var latlng, oldlatlng; 
    var heading = 0, oldheading = 0;
    var speedFromTrack, speedFromDist;
    var etmp;
    var trackpoints; 
    var dist = 0, totalDist = 0;
    var maxaltitude = 0;
    var maxSpeed=0;

    maxlat = 0;
    maxlon = 0;
    minlat = 10000;
    minlon = 10000;

    trackpoints = trackSegment.getElementsByTagName("trkpt");
    if (trackpoints.length == 0)
    {
            return; //latlngbounds;
    }

    var hasSpeed = trackpoints[0].getElementsByTagName("speed").length > 0 ? true : false;
    console.log(" hasSpeed: " + hasSpeed);

    speedFromDist = 0;

    for (var i=0; i < trackpoints.length; i++)
    {

            lon = parseFloat(trackpoints[i].getAttribute("lon"));
            lat = parseFloat(trackpoints[i].getAttribute("lat"));

            if (lon > maxlon) {
                maxlon = lon;	
            }
            if (lon < minlon){
                minlon = lon;
            }
            if (lat > maxlat) {
                maxlat = lat;	
            }
            if (lat < minlat){
                minlat = lat;
            }

            oldlatlng = latlng; 

            etmp = trackpoints[i].getElementsByTagName("ele");
            if (etmp.length > 0){
                altitude = parseFloat(etmp[0].textContent);
            }
            etmp = trackpoints[i].getElementsByTagName("time");
            if (etmp.length > 0){
                time = Date.parse(etmp[0].textContent);
            }
            etmp = trackpoints[i].getElementsByTagName("speed");
            if (etmp.length > 0){
                speedFromTrack = (parseFloat(etmp[0].textContent) * 3600) / 1852;
            }

            altitude = altitude * 3.28084; // m => feet
            if (altitude > maxaltitude)
            {
                maxaltitude = altitude;
            }

            latlng = new google.maps.LatLng(lat, lon);

            if (i > 0) 
            {
                if (time > oldtime)
                {
                    dist = google.maps.geometry.spherical.computeDistanceBetween(
                                        latlng, oldlatlng);
                    totalDist += dist;
                    speedFromDist = dist * 1000 * 3600  / (1852 * (time - oldtime));

                    if (speedFromDist)
                    {
                        heading = google.maps.geometry.spherical.computeHeading(oldlatlng, latlng);
                        oldheading = heading;
                    } 
                    else // distance is too small to calculate proper heading
                    {	
                        heading = oldheading;
                    }	

                    feetPerMinute = (altitude - lastaltitude) * 60 * 1000/ (time - oldtime);

                    oldtime = time;
                    lastaltitude = altitude;
                    lastFeetPerMinute = feetPerMinute;

                } 
                else // time <= oldtime
                {
                    heading = oldheading;
                    feetPerMinute = lastFeetPerMinute;
                }				
            }  
            else 
            {
                heading = oldheading;
                lastaltitude = altitude;
                feetPerMinute = 0;
            }

            heading = ( heading + 360 )% 360; //make sure heading is between 0 and 360

            if (hasSpeed)
            {
                speed = speedFromTrack;

            }
            else
            {
                speed = speedFromDist;
            }	

            if (speed > maxSpeed)
            {
                maxSpeed = speed;
            }

            var clatlng = new CLocTime(latlng, altitude, time, speed, speedFromDist, heading, feetPerMinute);

            pts.push(clatlng);
    }
}

// get the bounds of any segment in the track
function getBounds(firstIndex, lastIndex)
{
    var maxlat = 0;
	var	maxlng = 0;
	var	minlat = 10000;
	var	minlng = 10000;
	var bounds;
	
	for (var i = firstIndex; i < lastIndex; i++)
	{
		var lat = pointarray[i].LatLng.lat();
		var lng = pointarray[i].LatLng.lng();
		if (lat > maxlat)
		{
			maxlat = lat;
		} 
		if (lat < minlat)
		{
			minlat = lat;
		}
		if (lng > maxlng)
		{
			maxlng = lng;
		}
		if (lng < minlng)
		{
			minlng = lng;
		}
	}
	
	bounds = new google.maps.LatLngBounds(new google.maps.LatLng(minlat, minlng), 
										  new google.maps.LatLng(maxlat, maxlng));	
	
	return bounds;} 


// get the bounds of any segment in the track
function getBoundsForArray(a)
{
	var maxlat = 0;
	var	maxlng = 0;
	var	minlat = 10000;
	var	minlng = 10000;
	var bounds;
	
	for (var i = 0; i < a.length; i++)
	{
		var lat = a[i].lat();
		var lng = a[i].lng();
		if (lat > maxlat)
		{
			maxlat = lat;
		} 
		if (lat < minlat)
		{
			minlat = lat;
		}
		if (lng > maxlng)
		{
			maxlng = lng;
		}
		if (lng < minlng)
		{
			minlng = lng;
		}
	}
	
	bounds = new google.maps.LatLngBounds(new google.maps.LatLng(minlat, minlng), 
										  new google.maps.LatLng(maxlat, maxlng));	
	
	return bounds;
} 

function mapInit() {

	var centerOfMap = pointarray[0].LatLng;

	var latLngBnds = new google.maps.LatLngBounds(new google.maps.LatLng(minlat, minlon),
		new google.maps.LatLng(maxlat, maxlon));

	centerOfMap = new google.maps.LatLng((maxlat + minlat)/2, (maxlon + minlon)/2);
	var mapOptions = {
		streetViewControl: false ,
		fullscreenControl: true , 
    	zoom: 8	,
	};

	map = new google.maps.Map(document.getElementById('map-canvas'),
    	  mapOptions);
	map.fitBounds(latLngBnds);

	var polyOptions = {
   		strokeColor: '#FF0000',
    	strokeOpacity: 1.0,
    	strokeWeight: 2,
    	map: map,
	};

	poly = new google.maps.Polyline(polyOptions);

	var path = [];
	for (var i = 0; i< pointarray.length; i++){
    	path.push(pointarray[i].LatLng);
	}

	poly.setPath(path);

	var image = 'blueDotSmall.png';

	planePosition = new google.maps.Marker({
		position: pointarray[0].LatLng,
 		map: map,
 		icon: image
	});
}	


function mapSetPoly(rows) {

	var centerOfMap;
	var mapBounds;

	var path = [];
	poly.setVisible(false);

	console.log(rows);
	for (var i = 0; i< rows.length; i++){
    	path.push(pointarray[rows[i]].LatLng);
	}

	mapBounds = getBounds(rows[0], rows[rows.length - 1]);
	centerOfMap = mapBounds.getCenter();

	offset = rows[0];

	var polyOptions = {
    	strokeColor: '#FF0000',
    	strokeOpacity: 1.0,
    	strokeWeight: 2,
    	map: map,
	};


	map.setCenter(centerOfMap);
	map.fitBounds(mapBounds);

	poly = new google.maps.Polyline(polyOptions);
	poly.setPath(path);
	setPlanePosition(0);
	poly.setVisible(true);

}
