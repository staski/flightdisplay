<!-- eslint-disable no-undef -->
<script setup>
import 'bootstrap/dist/css/bootstrap.min.css'

import FlightDisplay from './flightDisplay.vue';
</script>

<style scoped>
.my-flight-display {
  margin: 10px;
  padding: 10px;
  width: 50%;
  height: 70vh;
}
</style>

<template>
  <div style="margin: 10px; padding: 10px; width: 50%" class="border border-danger">
    this is a test  text before 
    this is a test  text before 
    this is a test  text before 
    this is a test  text before 
    this is a test  text before 
    this is a test  text before 
    this is a test  text before 
    this is a test  text before 
  </div>
  <FlightDisplay title="Show my Flights" class="my-flight-display border border-danger"></FlightDisplay>
  <div style="margin: 10px; padding: 10px" class="border border-danger">
    this is a test text after
    this is a test text after
    this is a test text after
    this is a test text after
    this is a test text after
    this is a test text after
    this is a test text after
    this is a test text after
    this is a test text after
    this is a test text after
    this is a test text after
    this is a test text after
    this is a test text after
    this is a test text after
    this is a test text after
  </div>
</template>

