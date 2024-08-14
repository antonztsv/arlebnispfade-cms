<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchRoutes, Route } from '@/api/routes';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import RouteCard from '@/components/RouteCard.vue';

const routes = ref<Route[]>([]);
const loading = ref(true);
const props = defineProps({
  filter: {
    type: Number,
    default: 3,
  },
  gridCols: {
    type: Number,
    default: 3,
  },
});

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
</script>

<template>
  <section class="mb-12">
    <RouterLink to="/routes">
      <h2 class="mb-4 inline-block font-headline text-3xl font-bold hover:text-gray-600">
        Routen
        <span v-if="!loading" class="text-sm text-gray-500">({{ routes.length }})</span>
      </h2>
    </RouterLink>
    <LoadingSpinner v-if="loading" />
    <div v-else :class="`grid grid-cols-1 gap-4 md:grid-cols-${props.gridCols}`">
      <RouteCard v-for="route in routes.slice(0, props.filter)" :key="route.id" :route="route" />
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
