<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { fetchRoutes, Route } from '@/api/routes';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import RouteCard from '@/components/RouteCard.vue';
import LinkTitle from '@/components/LinkTitle.vue';

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

const filteredRoutes = computed(() => {
  return props.filter ? routes.value.slice(0, props.filter) : routes.value;
});

const gridStyle = computed(() => {
  return { '--grid-cols': props.gridCols };
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
    <LinkTitle title="Routen" to="/routes" :loading :count="routes.length" />
    <LoadingSpinner v-if="loading" />
    <div v-else class="routes-grid" :style="gridStyle">
      <RouteCard
        v-for="route in filteredRoutes"
        :key="route.id"
        :route="route"
        :editable="editable"
      />
    </div>
  </section>
</template>

<style scoped>
.routes-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1rem;
}

@media (min-width: 768px) {
  .routes-grid {
    grid-template-columns: repeat(var(--grid-cols, 3), minmax(0, 1fr));
  }
}

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
