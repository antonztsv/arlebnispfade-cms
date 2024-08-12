<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchRoutes, Route } from '@/api/routes';
import { fetchPullRequests, PullRequest } from '@/api/pullRequests';

const router = useRouter();
const routes = ref<Route[]>([]);
const pullRequests = ref<PullRequest[]>([]);
const displayedPullRequests = ref(3);

onMounted(async () => {
  try {
    routes.value = await fetchRoutes();
    pullRequests.value = await fetchPullRequests();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

const navigateToPOIs = (routeId: string) => {
  router.push({ name: 'pois', params: { routeId } });
};

const showMorePullRequests = () => {
  displayedPullRequests.value += 3;
};
</script>

<template>
  <div>
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

    <section>
      <h2 class="mb-4 font-headline text-3xl font-bold">
        <span class="pi pi-arrow-right-arrow-left mr-3 text-2xl"></span>Änderungen
      </h2>
      <div class="space-y-4">
        <div
          v-for="pr in pullRequests.slice(0, displayedPullRequests)"
          :key="pr.id"
          class="cursor-pointer rounded bg-gray-100 p-4 shadow"
        >
          <h3 class="text-lg">{{ pr.title }}</h3>

          <p>{{ pr.description }}</p>
        </div>
      </div>
      <button
        v-if="displayedPullRequests < pullRequests.length"
        @click="showMorePullRequests"
        class="mt-4 rounded bg-blue-500 px-4 py-2 text-black"
      >
        Mehr anzeigen
      </button>
    </section>
  </div>
</template>
