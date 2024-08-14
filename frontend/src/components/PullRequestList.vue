<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchPullRequests, PullRequest } from '@/api/pullRequests';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

const pullRequests = ref<PullRequest[]>([]);
const loading = ref(true);

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

onMounted(async () => {
  loading.value = true;
  try {
    pullRequests.value = await fetchPullRequests();
  } catch (error) {
    console.error('Error fetching pull requests:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <section>
    <RouterLink to="/changes">
      <h2 class="mb-4 inline-block font-headline text-3xl font-bold hover:text-gray-600">
        Änderungen
      </h2>
    </RouterLink>
    <LoadingSpinner v-if="loading" />
    <div v-else class="space-y-4">
      <RouterLink
        :to="`/changes/${pr.number}`"
        v-for="pr in pullRequests.slice(0, 3)"
        :key="pr.id"
        class="changes-card flex justify-between rounded-lg bg-gray-50 p-4 py-6 shadow-lg transition-colors hover:bg-gray-100"
      >
        <div>
          <h3 class="font-semibold">
            <span class="text-gray-500">#{{ pr.number }}</span> {{ pr.title.substring(0, 50) }}
          </h3>
          <p class="text-sm text-gray-600">
            {{ formatDate(pr.created_at) }}
          </p>
        </div>
        <div
          class="self-center rounded-md transition-transform duration-300 ease-in-out hover:bg-gray-100"
        >
          <span class="pi pi-arrow-right text-lg"></span>
        </div>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.changes-card:hover .self-center {
  transform: translateX(-10px);
}
</style>
