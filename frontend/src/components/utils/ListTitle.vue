<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  count: {
    type: Number,
    default: 0,
  },
});
</script>

<template>
  <div>
    <h2 class="mb-4 inline-block font-headline text-3xl font-bold">
      {{ title }}
      <span v-if="!loading" class="text-sm text-gray-500">({{ count }})</span>
    </h2>
  </div>
</template>
