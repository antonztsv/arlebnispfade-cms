<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchPOIsForRoute, POI } from '@/api/pois';
import POIDetail from '@/components/POIDetail.vue';

const route = useRoute();
const router = useRouter();
const pois = ref<POI[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    const routeId = route.params.routeId as string;
    console.log('Fetching POIs for route:', routeId);
    pois.value = await fetchPOIsForRoute(routeId);
  } catch (e) {
    error.value = 'Fehler beim Laden der POIs. Bitte versuchen Sie es später erneut.';
    console.error('Error fetching POIs:', e);
  } finally {
    loading.value = false;
  }
});

const selectPOI = (poiId: string) => {
  router.push({ name: 'poi-detail', params: { ...route.params, poiId } });
};
</script>

<template>
  <div class="flex">
    <div class="w-1/3 pr-4">
      <h2 class="mb-4 text-2xl font-bold">POIs</h2>
      <div v-if="loading" class="text-center">
        <p>Lade POIs...</p>
      </div>
      <div v-else-if="error" class="text-center text-red-600">
        <p>{{ error }}</p>
      </div>
      <ul v-else class="space-y-2">
        <li
          v-for="poi in pois"
          :key="poi.id"
          @click="selectPOI(poi.id)"
          class="cursor-pointer rounded p-2 hover:bg-gray-100"
          :class="{ 'bg-gray-200': route.params.poiId === poi.id }"
        >
          {{ poi.title }}
        </li>
      </ul>
    </div>
    <div class="w-2/3">
      <RouterView />
    </div>
  </div>
</template>
