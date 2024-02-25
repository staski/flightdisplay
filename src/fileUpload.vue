<template>
    <label class="file-label"> 
        <i class="bi-upload"></i>
            Choose GPX Files ...
        <input
            type="file"
            ref="file"
            accept=".gpx"
            multiple
            @change="handleFileUpload()"
            class="file-input" id="inputfile01">
    </label>
</template>

<style scoped>

.file-input {
    width: 0px;
    height: 0px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
}

.bi-upload {
    font-size: 1rem;
    font-weight: 700;
    margin: 5px;
}

.file-label {
    font-size: 1rem;
    font-weight: 700;
    color: white;
    background-color: green;
    display: inline-block;
    cursor: pointer;
    padding: 5px;
    margin: 5px;
    border-radius: 5px;
}

.file-label:hover {
    background-color: orangered;
}
</style>

<script setup>
import { ref } from 'vue'
import 'bootstrap-icons/font/bootstrap-icons.min.css'

const file = ref(0)
const emit = defineEmits(['fileInput'])

function handleFileUpload() {
    emit('fileInput', file.value.files);
}
</script>
