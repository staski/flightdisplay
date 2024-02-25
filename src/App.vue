<!-- eslint-disable no-undef -->
<script setup>
//import 'bootstrap/dist/css/bootstrap.min.css'

import FlightDisplay from './flightDisplay.vue';
</script>

<style scoped>
.my-flight-display {
  margin: 10px;
  padding: 10px;
}

</style>

<template>
  <div class="my-flight-display container-fluid">
    <div class="row">
    <div class="col-10">
    <FlightDisplay width="100%" height="100vh" title="Show my Flights"></FlightDisplay>
    </div>
    <div class="col">Test</div>
  </div>
  </div>
</template>

