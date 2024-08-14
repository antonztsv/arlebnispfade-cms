<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchRoutes, Route } from '@/api/routes';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

const router = useRouter();
const routes = ref<Route[]>([]);
const loading = ref(true);

onMounted(async () => {
  loading.value = true;
  try {
    routes.value = await fetchRoutes();
  } catch (error) {
    console.error('Error fetching routes:', error);
  } finally {
    loading.value = false;
  }
});

const navigateToPOIs = (routeId: string) => {
  router.push({ name: 'pois', params: { routeId } });
};
</script>

<template>
  <section class="mb-12">
    <RouterLink to="/routes">
      <h2 class="mb-4 inline-block font-headline text-3xl font-bold hover:text-gray-600">Routen</h2>
    </RouterLink>
    <LoadingSpinner v-if="loading" />
    <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-3">
      <RouterLink
        :to="{ name: 'pois', params: { routeId: route.id } }"
        v-for="route in routes.slice(0, 3)"
        :key="route.id"
        class="route-card cursor-pointer overflow-hidden rounded-lg shadow-lg"
        @click="navigateToPOIs(route.id)"
      >
        <div class="relative h-64 overflow-hidden">
          <div
            class="absolute inset-0 bg-cover bg-center transition-transform duration-300 ease-in-out"
            :style="{
              backgroundImage: `url(https://raw.githubusercontent.com/antonztsv/ar-lebnispfade/main/src/${route.id}/images/small/${route.image})`,
            }"
          ></div>
          <div
            class="absolute inset-0 bg-black opacity-30 transition-opacity duration-300 ease-in-out"
          ></div>

          <h3
            class="absolute bottom-4 left-4 text-lg font-semibold text-white transition-transform duration-300 ease-in-out"
          >
            {{ route.title }}
          </h3>
        </div>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.route-card:hover .bg-cover {
  transform: scale(1.1);
}

.route-card:hover .bg-black {
  opacity: 0.5;
}

.route-card:hover h3 {
  transform: translateY(-10px);
}
</style>
