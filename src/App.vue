<!-- eslint-disable no-undef -->
<script setup>
import 'bootstrap/dist/css/bootstrap.min.css'

import FlightDisplay from './flightDisplay.vue';
</script>

<style scoped>
.top {
  background-color: tomato;
}
.my-flight-display {
  margin-left: 15%;
  padding: 10px;
  width: 70%;
  height: 70vh;
  color: floralwhite;
}

.main {
  padding: 10px;
  color: floralwhite;
  font-family: Tahoma, "Trebuchet MS", sans-serif;
  font-size: 1.2em;
}


#app {
  background-color: black;
}
h1 {
  background: linear-gradient(to left ,
                    violet,
                    indigo,
                    blue,
                    green,
                    yellow,
                    orange,
                    red);
  -webkit-background-clip: text;
  color: transparent;
  font-family: Tahoma, "Trebuchet MS", sans-serif;
  font-size: 6rem;
  font-weight: bolder;
  text-align: center;}
</style>

<template>
<div class="top">
  <div class="main" >
    <h1>SHOW MY FLIGTHS</h1>
    The flight-display app lets you display any number of your flight-tracks in a Google Map. Choose the tracks (as gpx-files) from your local storage. 
    A filter lets you select or deselect all flights of a particular year dynamically. 
  </div>
  <FlightDisplay  class="my-flight-display"></FlightDisplay>
  <div class="main">
    This app runs locally in your browser, so your flight data will not be sent over the internet to any server. For each flight track, 
    the app creates a 'path', consisting of the track points at every minute of your flight. As the departure airport 
    of a flight typically is identical to the landing airport of the previous flight (if the flights are with the same plane and all flights are recorded), the app, for those 
    cases, joins both paths if they happen in the same year. This results in a set of paths which is sent the Google Maps service for rendering.
    <p/>
    The app is created as a <a href="https://vuejs.org"> Vue </a> component,  see the <a href=https://github.com/staski/flightdisplay>flight-display app on GitHub</a>.
    <p/>
    Other software tools on <a href="https://fly.venus-flytrap.de/diy">CP's aviation pages</a>.
  </div>
</div>
</template>

