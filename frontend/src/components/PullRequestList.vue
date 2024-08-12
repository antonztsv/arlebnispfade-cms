<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchPullRequests, PullRequest } from '@/api/pullRequests';

const pullRequests = ref<PullRequest[]>([]);
const displayedPullRequests = ref(3);

onMounted(async () => {
  try {
    pullRequests.value = await fetchPullRequests();
  } catch (error) {
    console.error('Error fetching pull requests:', error);
  }
});

const showMorePullRequests = () => {
  displayedPullRequests.value += 3;
};
</script>

<template>
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
</template>
