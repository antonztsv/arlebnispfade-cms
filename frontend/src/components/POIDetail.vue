<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { fetchPOIById, POI } from '@/api/pois';

const route = useRoute();
const poi = ref<POI | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const routeId = ref('');
const poiId = ref('');

const loadPOI = async () => {
  loading.value = true;
  error.value = null;
  try {
    routeId.value = route.params.routeId as string;
    poiId.value = route.params.poiId as string;
    poi.value = await fetchPOIById(routeId.value, poiId.value);
  } catch (e) {
    error.value = 'Fehler beim Laden des POI. Bitte versuchen Sie es später erneut.';
    console.error('Error fetching POI:', e);
  } finally {
    loading.value = false;
  }
};

onMounted(loadPOI);

watch(() => route.params.poiId, loadPOI);
</script>

<template>
  <div v-if="loading" class="text-center">
    <p>Lade POI-Details...</p>
  </div>
  <div v-else-if="error" class="text-center text-red-600">
    <p>{{ error }}</p>
  </div>
  <div v-else-if="poi" class="mx-auto max-w-2xl">
    <h1 class="mb-4 text-3xl font-bold">{{ poi.title }}</h1>
    <img
      :src="`https://raw.githubusercontent.com/antonztsv/ar-lebnispfade/main/src/${routeId}/images/${poi.image}`"
      :alt="poi.title"
      class="mb-4 h-64 w-full rounded-lg object-cover"
    />
    <div class="mb-4 rounded-lg bg-gray-100 p-4">
      <h2 class="mb-2 text-xl font-semibold">Information</h2>
      <p>{{ poi.info }}</p>
    </div>
    <div class="mb-4 rounded-lg bg-gray-100 p-4">
      <h2 class="mb-2 text-xl font-semibold">AR-Beschreibung</h2>
      <p>{{ poi.arDesc }}</p>
    </div>
    <div v-if="poi.gmaps" class="mb-4">
      <a :href="poi.gmaps" target="_blank" class="text-blue-600 hover:underline">
        Auf Google Maps anzeigen
      </a>
    </div>
    <div v-if="poi.content" class="prose max-w-none">
      <div v-html="poi.content"></div>
    </div>
  </div>
</template>
