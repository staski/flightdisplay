<template>
   <div     class="input-group mb-3">
        <label class="input-group-text" for="inputGroupFile01">Upload</label>
        <input
            type="file"
            ref="file"
            accept=".gpx"
            multiple
            @change="handleFileUpload()"
            class="form-control" id="inputGroupFile01">
    </div>
</template>

<script setup>
import { ref } from 'vue'
const file = ref(0)
const emit = defineEmits(['fileInput'])

function handleFileUpload() {
    emit('fileInput', file.value.files);
}
</script>
