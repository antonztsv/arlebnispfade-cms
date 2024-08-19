<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchPullRequests, PullRequest } from '@/api/pullRequests';
import LoadingSpinner from '@/components/utils/LoadingSpinner.vue';
import PullRequestCard from '@/components/pullRequests/PullRequestCard.vue';
import LinkTitle from '@/components/utils/LinkTitle.vue';

const pullRequests = ref<PullRequest[]>([]);
const loading = ref(true);
const props = defineProps({
  filter: {
    type: Number,
    default: null,
  },
  detailed: {
    type: Boolean,
  },
});

onMounted(async () => {
  await loadPullRequests();
});

const loadPullRequests = async () => {
  loading.value = true;
  try {
    pullRequests.value = await fetchPullRequests();
  } catch (error) {
    console.error('Error fetching pull requests:', error);
  } finally {
    loading.value = false;
  }
};

const removePullRequest = (prNumber: number) => {
  pullRequests.value = pullRequests.value.filter((pr) => pr.number !== prNumber);
};

const handlePrUpdated = (prNumber: number) => {
  removePullRequest(prNumber);
};
</script>

<template>
  <section class="mb-12">
    <LinkTitle title="Änderungen" to="/changes" :loading :count="pullRequests.length" />
    <LoadingSpinner v-if="loading" />
    <div v-else class="space-y-4">
      <PullRequestCard
        v-for="pr in filter ? pullRequests.slice(0, props.filter) : pullRequests"
        :key="pr.id"
        :pull-request="pr"
        :detailed="detailed"
        @pr-updated="handlePrUpdated"
      />
    </div>
  </section>
</template>
