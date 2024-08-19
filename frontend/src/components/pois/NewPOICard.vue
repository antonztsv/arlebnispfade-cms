<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

function createNewPOI() {
  const routeId = route.params.routeId as string;
  const newPoiId = 'new'; // temporary new id
  router.push({ name: 'poi-detail', params: { routeId, poiId: newPoiId } });
}
</script>

<template>
  <div
    @click="createNewPOI"
    class="new-poi-card cursor-pointer rounded-lg border border-gray-300 bg-gray-100 p-4 hover:bg-gray-200"
  >
    <div class="flex h-full items-center justify-center">
      <span class="pi pi-plus text-2xl text-gray-400"></span>
    </div>
  </div>
</template>
