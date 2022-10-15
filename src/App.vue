<script setup>
import { ref, onMounted } from 'vue'
import FileUpload from './fileUpload.vue'
import {parseGpxFile, mapSetPoly } from './fdgpx'
import { Loader } from 'google-maps';
import 'bootstrap/dist/css/bootstrap.min.css'

const mapDiv = ref(null)
const GOOGLE_MAPS_API_KEY = 'AIzaSyBYb80Mm61u6J8Cjtt82nJQ0H2AW4zp03g'
const goptions = {'libraries': ["geometry", "drawing"]}
const edfmCoords = { lat: 49.473057, lng: 8.514167}
const loader = new Loader(GOOGLE_MAPS_API_KEY, goptions)

var readers = [];

let map = ref(0)
var myfiles;
var fileCount = 0;
var allFlights = [];
var polys = [];


onMounted(async () => {
    await loader.load()
    map.value = new google.maps.Map(mapDiv.value, {
        center: edfmCoords,
        gestureHandling: "greedy",
        zoom: 5,
    });
})

function handleFilesComplete() {
    allFlights.sort((x,y) => x.takeoffTime > y.takeoffTime);
    var reducedFlights = [0];
    for (let i = 1; i < allFlights.length; i++){
        let prev = allFlights[i-1].coords
        let current = allFlights[i].coords
        let a = current[0];
        let b = prev[prev.length-1];
        let dist = google.maps.geometry.spherical.computeDistanceBetween(a, b);

        if (dist > 1000){
            reducedFlights.push(i+1);
        }
    }
    
    let last = allFlights.length
    reducedFlights.push(last)

    for (let i = 0; i < reducedFlights.length - 1 ; i++){
        var mypath = []
        for (let j = reducedFlights[i]; j < reducedFlights[i+1]; j++){
            mypath = mypath.concat(allFlights[j].coords)
        }
        polys.push(mapSetPoly(map.value, mypath));
    }
}

function handleGpxRead (data) {
        let flightPathCoords = parseGpxFile(data);
        allFlights.push(flightPathCoords)
        fileCount += 1;
        if (fileCount == myfiles.length){
            handleFilesComplete()
        }
}


function fileInput(arg) {
    fileCount = 0; allFlights =[];
    for ( let i = 0; i < polys.length; i++){
        polys[i].setMap(null)
    }
    polys = [];
    readers = [];

    myfiles = Array.from(arg)
    for (let i = 0; i < myfiles.length; i++){
        loadFile(myfiles[i])
    }
}

function loadFile(mf) {
    var reader  = new FileReader();
    reader.readAsText(mf);
    reader.onload = function() {
        handleGpxRead(reader.result)
    }
}

</script>

<template>
  <div >
        <FileUpload @file-input="fileInput"/>
        <div ref="mapDiv" style="width: 100%; height: 90vh" />
    </div>
</template>

