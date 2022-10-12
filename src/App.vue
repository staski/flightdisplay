<script setup>
import { ref, onMounted } from 'vue'
import FileUpload from './fileUpload.vue'
import {parseGpxFile} from './fdgpx'
import { Loader } from 'google-maps';
import 'bootstrap/dist/css/bootstrap.min.css'

const mapDiv = ref(null)
const GOOGLE_MAPS_API_KEY = 'AIzaSyBYb80Mm61u6J8Cjtt82nJQ0H2AW4zp03g'
const goptions = {'libraries': ["geometry", "drawing"]}
const edfmCoords = { lat: 49.473057, lng: 8.514167}
const loader = new Loader(GOOGLE_MAPS_API_KEY, goptions)

var readers = [];

let map = ref(0)
let path = ref(0)



onMounted(async () => {
    await loader.load()
    map.value = new google.maps.Map(mapDiv.value, {
        center: edfmCoords,
        zoom: 12,
    });
})

var myfiles;
var fileCount = 0;
var allFlights = [];

function handleFilesComplete() {
    allFlights.sort((x,y) => x.takeoffTime > y.takeoffTime);
    var reducedFlights = [0];
    var prev = allFlights[0].coords
    for (let i = 1; i < allFlights.length; i++){
        let current = allFlights[i].coords
        let a = current[0];
        let b = prev[prev.length-1];
        let dist = google.maps.geometry.spherical.computeDistanceBetween(a, b);
        console.log(a.lat(), a.lng(), b.lat(), b.lng(), dist)
        if (dist < 1000){
            prev = current;
        } else {
            reducedFlights.push(i+1);
            prev = current;
        }
    }
    console.log("reduced: ", reducedFlights)
}

function handleGpxRead (data) {
        let flightPathCoords = parseGpxFile(data);
        const flightPath = new google.maps.Polyline( {
            path: flightPathCoords.coords,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 2,
        });
        allFlights.push(flightPathCoords)
        console.log(allFlights)
        //flightPath.setMap(map.value);
        fileCount += 1;
        console.log("processed files:", fileCount)
        if (fileCount == myfiles.length){
            handleFilesComplete()
        }
}


function fileInput(arg) {
    //fileCount = 0
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
  <div class="d-flex text-center" style="width: 100%; height: 20vh">
    <div class="m-auto">
      <h4>Your Position</h4>
    </div>
    <div class="m-auto">
      <h4>Distance</h4>
    </div>
    <div class="m-auto">
        <FileUpload @file-input="fileInput"/>
    </div>
  </div>
  <div ref="mapDiv" style="width: 100%; height: 80vh" />
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
