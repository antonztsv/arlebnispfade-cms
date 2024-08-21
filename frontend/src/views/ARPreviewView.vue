<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { fetchPOIById, POI } from '@/api/pois';
import ARViewer from '@/components/ar/ARViewer.vue';
import LoadingSpinner from '@/components/utils/LoadingSpinner.vue';

const route = useRoute();
const poi = ref<POI | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const showAR = ref(false);

onMounted(async () => {
  try {
    const { routeId, poiId } = route.params;
    poi.value = await fetchPOIById(routeId as string, poiId as string);
    loading.value = false;
  } catch (err) {
    console.error('Error fetching POI:', err);
    error.value = 'Failed to load POI data';
    loading.value = false;
  }
});

const startAR = () => {
  showAR.value = true;
};
</script>

<template>
  <div class="ar-preview-view">
    <h1 class="mb-4 text-2xl font-bold">AR Preview</h1>
    <LoadingSpinner v-if="loading" />
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="poi">
      <h2 class="mb-2 text-xl font-semibold">{{ poi.title }}</h2>
      <p>{{ poi.arDesc }}</p>
      <button
        @click="startAR"
        class="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Start AR Preview
      </button>
      <ARViewer
        v-if="showAR"
        :routeId="route.params.routeId as string"
        :poiId="route.params.poiId as string"
        :nfts="poi.ar.nft"
      />
    </div>
  </div>
</template>
