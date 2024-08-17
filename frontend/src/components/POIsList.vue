<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { fetchPOIsForRoute, createPOI, deletePOI, POI } from '@/api/pois';
import { fetchRoute, Route } from '@/api/routes';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import ListTitle from '@/components/ListTitle.vue';
import POICard from '@/components/POICard.vue';
import NewPOICard from '@/components/NewPOICard.vue';
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
    return `ARlebnisse in ${currentRoute.value.title}`;
  }
  return 'ARlebnisse';
});

async function handleNewPOI(newPOIData: Omit<POI, 'id'>) {
  try {
    const createdPOI = await createPOI(routeId.value, newPOIData);
    pois.value.push(createdPOI);
    toast.success('POI created successfully');
  } catch (error) {
    console.error('Error creating POI:', error);
    toast.error('Failed to create POI');
  }
}

async function handleDeletePOI(poiId: string) {
  try {
    await deletePOI(routeId.value, poiId);
    pois.value = pois.value.filter((poi) => poi.id !== poiId);
    toast.success('POI deleted successfully');
  } catch (error) {
    console.error('Error deleting POI:', error);
    toast.error('Failed to delete POI');
  }
}
</script>

<template>
  <div>
    <ListTitle :title="title" :to="route.fullPath" :loading="loading" :count="pois.length" />
    <LoadingSpinner v-if="loading" />
    <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <POICard v-for="poi in pois" :key="poi.id" :poi="poi" @delete="handleDeletePOI" />
      <NewPOICard @create="handleNewPOI" />
    </div>
  </div>
</template>
