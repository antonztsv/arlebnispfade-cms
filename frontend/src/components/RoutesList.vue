<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchRoutes, Route } from '@/api/routes';

const router = useRouter();
const routes = ref<Route[]>([]);

onMounted(async () => {
  try {
    routes.value = await fetchRoutes();
  } catch (error) {
    console.error('Error fetching routes:', error);
  }
});

const navigateToPOIs = (routeId: string) => {
  router.push({ name: 'pois', params: { routeId } });
};
</script>

<template>
  <section class="mb-12">
    <h2 class="mb-4 font-headline text-3xl font-bold">Routen</h2>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div
        v-for="route in routes.slice(0, 3)"
        :key="route.id"
        class="cursor-pointer overflow-hidden rounded-lg shadow-lg transition-transform"
        @click="navigateToPOIs(route.id)"
      >
        <div
          class="h-48 bg-cover bg-center"
          :style="{
            backgroundImage: `url(https://raw.githubusercontent.com/antonztsv/ar-lebnispfade/main/src/${route.id}/images/small/${route.image}`,
          }"
        ></div>
        <div class="bg-white p-4">
          <h3 class="text-lg font-semibold">{{ route.title }}</h3>
        </div>
      </div>
    </div>
    <div class="mt-4">
      <RouterLink
        to="/routes"
        class="inline-block rounded bg-slate-500 px-4 py-2 text-white hover:bg-slate-600"
      >
        Alle Routen anzeigen
      </RouterLink>
    </div>
  </section>
</template>
