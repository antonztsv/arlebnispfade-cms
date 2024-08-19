<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { fetchPOIsForRoute, POI } from '@/api/pois';
import { fetchRoute, Route } from '@/api/routes';
import LoadingSpinner from '@/components/utils/LoadingSpinner.vue';
import ListTitle from '@/components/utils/ListTitle.vue';
import POICard from '@/components/pois/POICard.vue';
import NewPOICard from '@/components/pois/NewPOICard.vue';
import { useToast } from 'vue-toastification';

const route = useRoute();
const toast = useToast();

const routeId = computed(() => route.params.routeId as string);
const pois = ref<POI[]>([]);
const loading = ref(true);
const currentRoute = ref<Route | null>(null);

onMounted(async () => {
  await loadPOIs();
});

async function loadPOIs() {
  loading.value = true;
  try {
    currentRoute.value = await fetchRoute(routeId.value);
    pois.value = await fetchPOIsForRoute(routeId.value);
  } catch (error) {
    console.error('Error fetching POIs:', error);
    toast.error('Failed to load POIs');
  } finally {
    loading.value = false;
  }
}

const title = computed(() => {
  if (currentRoute.value) {
    return `AR-Spots in ${currentRoute.value.title}`;
  }
  return 'AR-Spots';
});
</script>

<template>
  <div>
    <ListTitle :title="title" :to="route.fullPath" :loading="loading" :count="pois.length" />
    <LoadingSpinner v-if="loading" />
    <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <POICard v-for="poi in pois" :key="poi.id" :poi="poi" />
      <NewPOICard />
    </div>
  </div>
</template>
