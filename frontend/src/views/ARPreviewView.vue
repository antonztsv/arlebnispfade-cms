<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { POI } from '@/api/pois';
import ARViewer from '@/components/ar/ARViewer.vue';
import LoadingSpinner from '@/components/utils/LoadingSpinner.vue';
import { API_BASE_URL } from '@/api/config';

const route = useRoute();
const poi = ref<POI | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const showAR = ref(false);

onMounted(async () => {
  const token = route.query.token as string;
  if (token) {
    localStorage.setItem('token', token);
  }

  try {
    const { routeId, poiId } = route.params;
    const url = `${API_BASE_URL}/routes/${routeId}/pois/${poiId}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch POI data');
    }

    poi.value = await response.json();
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
