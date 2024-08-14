<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchPullRequests, PullRequest } from '@/api/pullRequests';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import PullRequestCard from '@/components/PullRequestCard.vue';

const pullRequests = ref<PullRequest[]>([]);
const loading = ref(true);
const props = defineProps({
  filter: {
    type: Number,
    default: 6,
  },
});

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
        <span v-if="!loading" class="text-sm text-gray-500">({{ pullRequests.length }})</span>
      </h2>
    </RouterLink>
    <LoadingSpinner v-if="loading" />
    <div v-else class="space-y-4">
      <PullRequestCard
        v-for="pr in pullRequests.slice(0, props.filter)"
        :key="pr.id"
        :pull-request="pr"
      />
    </div>
  </section>
</template>
