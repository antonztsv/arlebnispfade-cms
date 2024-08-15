<script setup lang="ts">
import { computed, PropType, ref } from 'vue';
import { POI } from '@/api/pois';
import { useRoute } from 'vue-router';

const route = useRoute();
const props = defineProps({
  poi: {
    type: Object as PropType<POI>,
    required: true,
  },
});

const imageUrl = computed(
  () =>
    `https://raw.githubusercontent.com/${import.meta.env.VITE_GH_OWNER}/${import.meta.env.VITE_GH_REPO}/main/src/${route.params.routeId}/images/small/${props.poi.image}`,
);
</script>

<template>
  <RouterLink
    :to="{ name: 'poi-detail', params: { routeId: route.params.routeId, poiId: poi.id } }"
    class="route-card overflow-hidden rounded-lg"
  >
    <div class="relative h-64 overflow-hidden">
      <div
        class="absolute inset-0 bg-cover bg-center transition-transform duration-300 ease-in-out"
        :style="{
          backgroundImage: `url(${imageUrl})`,
        }"
      ></div>
      <div
        class="absolute inset-0 bg-black opacity-30 transition-opacity duration-300 ease-in-out"
      ></div>

      <h3
        class="absolute bottom-4 left-4 text-lg font-semibold text-white transition-transform duration-300 ease-in-out"
      >
        {{ poi.title }}
      </h3>
    </div>
  </RouterLink>
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
