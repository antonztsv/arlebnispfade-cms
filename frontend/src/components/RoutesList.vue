<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchRoutes, Route } from '@/api/routes';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import RouteCard from '@/components/RouteCard.vue';
import ListTitle from '@/components/ListTitle.vue';

const routes = ref<Route[]>([]);
const loading = ref(true);
const props = defineProps({
  filter: {
    type: Number,
    default: null,
  },
  gridCols: {
    type: Number,
    default: 3,
  },
  editable: {
    type: Boolean,
    default: false,
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
    <ListTitle title="Routen" to="/routes" :loading :count="routes.length" />
    <LoadingSpinner v-if="loading" />
    <div v-else :class="`grid grid-cols-1 gap-4 md:grid-cols-${props.gridCols}`">
      <RouteCard
        v-for="route in filter ? routes.slice(0, props.filter) : routes"
        :key="route.id"
        :route="route"
        :editable="editable"
      />
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
