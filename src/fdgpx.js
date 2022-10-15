import fastXmlParser from 'fast-xml-parser'
//import { Loader } from 'google-maps';
export { parseGpxFile, mapSetPoly }

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

function mapSetPoly(map, path) {

	var centerOfMap;
	var mapBounds;
    var poly;
    
	mapBounds = getBoundsForArray(path)
	centerOfMap = mapBounds.getCenter();

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
	poly.setVisible(true);
    return poly;
}
