<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchRoutes, Route } from '@/api/routes';

const router = useRouter();
const routes = ref<Route[]>([]);

onMounted(async () => {
  try {
    routes.value = await fetchRoutes();
    console.log('Fetched routes:', routes.value);
  } catch (error) {
    console.error('Error fetching routes:', error);
  }
});

const navigateToPOIs = (routeId: string) => {
  console.log('Navigating to POIs for route:', routeId);
  router.push({ name: 'pois', params: { routeId } });
};
</script>

<template>
  <section class="mb-12">
    <h2 class="mb-4 font-headline text-3xl font-bold">
      <span class="pi pi-map mr-3 text-2xl"></span>Routen
    </h2>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div
        v-for="route in routes"
        :key="route.id"
        class="cursor-pointer rounded bg-gray-100 p-4 shadow"
        @click="navigateToPOIs(route.id)"
      >
        <h3 class="text-lg">{{ route.title }}</h3>
        <p>{{ route.description }}</p>
      </div>
    </div>
  </section>
</template>
