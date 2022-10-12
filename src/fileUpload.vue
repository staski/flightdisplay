<template>
    <input
        ref="file"
        type="file"
        accept=".gpx"
        multiple
        @change="handleFileUpload()">
</template>

<script setup>
import { ref } from 'vue'
const file = ref(0)
const emit = defineEmits(['fileInput'])

function handleFileUpload() {
    emit('fileInput', file.value.files);
}
</script>
