<script setup>
import { ref, reactive, onMounted } from 'vue'
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
var polyyears = [];

let availableyears = ref([])
let filteredyears = ref([])

onMounted(async () => {
    await loader.load()
    map.value = new google.maps.Map(mapDiv.value, {
        center: edfmCoords,
        gestureHandling: "greedy",
        zoom: 5,
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER,
        },
    });
})

function fileInput(arg) {
    fileCount = 0; allFlights =[];
    for ( let i = 0; i < polys.length; i++){
        polys[i].setMap(null)
    }
    polys = [];
    polyyears = [];
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

function handleGpxRead (data) {
        let flightPathCoords = parseGpxFile(data);
        allFlights.push(flightPathCoords)
        fileCount += 1;
        if (fileCount == myfiles.length){
            handleFilesComplete()
        }
}

function handleFilesComplete() {
    allFlights.sort((x,y) => x.takeoffTime > y.takeoffTime);
    var reducedFlights = [0];
    availableyears.value = [];
    var yearlast = (new Date(allFlights[0].takeoffTime)).getFullYear()
    availableyears.value.push(yearlast)
    filteredyears.value.push(yearlast)
    for (let i = 1; i < allFlights.length; i++){
        let prev = allFlights[i-1].coords
        let current = allFlights[i].coords
        let a = current[0];
        let b = prev[prev.length-1];
        let dist = google.maps.geometry.spherical.computeDistanceBetween(a, b);
        let year = (new Date(allFlights[i].takeoffTime)).getFullYear()
        if (year > yearlast){
            reducedFlights.push(i)
            availableyears.value.push(year)
            filteredyears.value.push(year)
            yearlast = year;
        } else if (dist > 1000){
            reducedFlights.push(i);
        }
    }
    
    let last = allFlights.length
    reducedFlights.push(last)

    for (let i = 0; i < reducedFlights.length - 1 ; i++){
        var mypath = [];
        var cyear = (new Date(allFlights[reducedFlights[i]].takeoffTime)).getFullYear();
        for (let j = reducedFlights[i]; j < reducedFlights[i+1]; j++){
            mypath = mypath.concat(allFlights[j].coords)
        }
        
        if (mypath.length == 0){
            console.log("zero: ", i, reducedFlights)
        }
        polys.push(mapSetPoly(map.value, mypath));
        polyyears.push(cyear);
    }
}

function filteryears() {
    for (let i = 0; i < polyyears.length; i++){
        polys[i].setVisible(false);
        for (let j = 0; j < filteredyears.value.length; j++) {
            if (polyyears[i] == filteredyears.value[j]){
                polys[i].setVisible(true);
            }
        }
    }
}

</script>

<template>
    <div class="h1 text-center text-danger">Show My Flights</div>
    <div>
        <FileUpload @file-input="fileInput"/>
        <div ref="mapDiv" style="width: 100%; height: 70vh" />
        <span v-for="item in availableyears" >
            <input  type="checkbox" :id="item" :value="item" checked v-model="filteredyears"
            @change="filteryears">
            <label :for="item">{{ item }}</label>
        </span>
    </div>
</template>

