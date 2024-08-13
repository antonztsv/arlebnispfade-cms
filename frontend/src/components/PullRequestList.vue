<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchPullRequests, PullRequest } from '@/api/pullRequests';

const pullRequests = ref<PullRequest[]>([]);

onMounted(async () => {
  try {
    pullRequests.value = await fetchPullRequests();
  } catch (error) {
    console.error('Error fetching pull requests:', error);
  }
});
</script>

<template>
  <section>
    <h2 class="mb-4 font-headline text-3xl font-bold">Änderungen</h2>
    <div class="space-y-4">
      <div
        v-for="pr in pullRequests.slice(0, 3)"
        :key="pr.id"
        class="cursor-pointer rounded bg-gray-100 p-4 shadow transition-colors hover:bg-gray-200"
      >
        <h3 class="text-lg font-semibold">{{ pr.title }}</h3>
        <p class="text-sm text-gray-600">{{ pr.description }}</p>
      </div>
    </div>
    <div class="mt-4">
      <RouterLink
        to="/changes"
        class="inline-block rounded bg-slate-500 px-4 py-2 text-white hover:bg-slate-600"
      >
        Alle Änderungen anzeigen
      </RouterLink>
    </div>
  </section>
</template>
