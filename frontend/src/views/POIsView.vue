<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchPOIsForRoute, POI } from '@/api/pois';

const route = useRoute();
const router = useRouter();
const pois = ref<POI[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    const routeId = route.params.routeId as string;
    pois.value = await fetchPOIsForRoute(routeId);
  } catch (e) {
    error.value = 'Fehler beim Laden der POIs. Bitte versuchen Sie es später erneut.';
    console.error('Error fetching POIs:', e);
  } finally {
    loading.value = false;
  }
});

const navigateToPOIDetail = (poiId: string) => {
  router.push({ name: 'poi-detail', params: { ...route.params, poiId } });
};
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="mb-8 text-4xl font-bold">Points of Interest</h1>
    <div v-if="loading" class="text-center">
      <p>Lade POIs...</p>
    </div>
    <div v-else-if="error" class="text-center text-red-600">
      <p>{{ error }}</p>
    </div>
    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="poi in pois"
        :key="poi.id"
        class="cursor-pointer overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105"
        @click="navigateToPOIDetail(poi.id)"
      >
        <div
          class="h-48 bg-cover bg-center"
          :style="{ backgroundImage: `url(${poi.image})` }"
        ></div>
        <div class="bg-white p-4">
          <h2 class="text-xl font-semibold">{{ poi.title }}</h2>
          <p class="mt-2 text-gray-600">{{ poi.info.substring(0, 100) }}...</p>
        </div>
      </div>
    </div>
  </div>
</template>
