<script setup lang="ts">
import { PropType } from 'vue';
import { Image } from '@/api/images';

defineProps({
  images: {
    type: Array as PropType<Image[]>,
    required: true,
  },
});
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <div v-for="image in images" :key="image.id" class="rounded-lg bg-white p-4 shadow">
      <img :src="image.url" :alt="image.filename" class="mb-2 h-32 w-full object-cover" />
      <h3 class="text-lg font-semibold">{{ image.filename }}</h3>
    </div>
  </div>
</template>
