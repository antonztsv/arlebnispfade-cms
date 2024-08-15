<script setup lang="ts">
import { PropType } from 'vue';
import { ARMedia } from '@/api/arMedia';

defineProps({
  arMedia: {
    type: Array as PropType<ARMedia[]>,
    required: true,
  },
});
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <div v-for="media in arMedia" :key="media.id" class="rounded-lg bg-white p-4 shadow">
      <h3 class="mb-2 text-lg font-semibold">{{ media.filename }}</h3>
      <p class="text-sm text-gray-600">Type: {{ media.type }}</p>
      <a :href="media.url" target="_blank" class="mt-2 inline-block text-blue-500 hover:underline"
        >View</a
      >
    </div>
  </div>
</template>
