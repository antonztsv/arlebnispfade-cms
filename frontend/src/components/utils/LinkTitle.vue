<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
  currentMaxCount: {
    type: Number,
  },
});
</script>

<template>
  <RouterLink :to>
    <h2 class="mb-4 inline-block font-headline text-3xl font-bold hover:text-gray-600">
      {{ title }}
      <span v-if="!loading" class="text-sm text-gray-500"
        >({{ currentMaxCount && currentMaxCount + ' / ' }}{{ count }})</span
      >
    </h2>
  </RouterLink>
</template>
