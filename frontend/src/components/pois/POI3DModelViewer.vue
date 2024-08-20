<script setup lang="ts">
import { computed } from 'vue';

interface Model {
  name: string;
  url: string;
}

const props = defineProps<{
  models: Model[];
}>();

const isSingleModel = computed(() => props.models.length === 1);
</script>

<template>
  <div class="mb-6">
    <h2 class="mb-4 text-2xl font-semibold">3D Modell Vorschau</h2>
    <div
      :class="{
        'grid gap-4': !isSingleModel,
        'sm:grid-cols-2': !isSingleModel,
      }"
    >
      <div v-for="model in models" :key="model.url" :class="{ 'mb-4': isSingleModel }">
        <h3 class="mb-2 text-lg font-medium">{{ model.name }}</h3>
        <model-viewer
          :src="model.url"
          :alt="`${model.name} preview`"
          auto-rotate
          camera-controls
          class="w-full rounded bg-gray-200"
          :style="{ height: isSingleModel ? '400px' : '400px' }"
        ></model-viewer>
      </div>
    </div>
  </div>
</template>
