<script setup lang="ts">
import { Route } from '@/api/routes';

defineProps<{
  route: Route;
}>();
</script>

<template>
  <RouterLink
    :to="{ name: 'pois', params: { routeId: route.id } }"
    class="route-card cursor-pointer overflow-hidden rounded-lg"
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
