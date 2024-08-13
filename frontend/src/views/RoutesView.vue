<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchRoutes, Route } from '@/api/routes';

const router = useRouter();
const routes = ref<Route[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    routes.value = await fetchRoutes();
  } catch (e) {
    error.value = 'Fehler beim Laden der Routen. Bitte versuchen Sie es später erneut.';
    console.error('Error fetching routes:', e);
  } finally {
    loading.value = false;
  }
});

const navigateToPOIs = (routeId: string) => {
  router.push({ name: 'pois', params: { routeId } });
};
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="mb-8 text-4xl font-bold">Alle Routen</h1>
    <div v-if="loading" class="text-center">
      <p>Lade Routen...</p>
    </div>
    <div v-else-if="error" class="text-center text-red-600">
      <p>{{ error }}</p>
    </div>
    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="route in routes"
        :key="route.id"
        class="cursor-pointer overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105"
        @click="navigateToPOIs(route.id)"
      >
        <div
          class="h-48 bg-cover bg-center"
          :style="{ backgroundImage: `url(${route.image || '/placeholder-image.jpg'})` }"
        ></div>
        <div class="bg-white p-4">
          <h2 class="text-xl font-semibold">{{ route.title }}</h2>
        </div>
      </div>
    </div>
  </div>
</template>
