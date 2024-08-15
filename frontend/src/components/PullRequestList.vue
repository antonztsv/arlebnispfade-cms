<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchPullRequests, PullRequest } from '@/api/pullRequests';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import PullRequestCard from '@/components/PullRequestCard.vue';
import ListTitle from '@/components/ListTitle.vue';

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
  <section class="mb-12">
    <ListTitle title="Änderungen" to="/changes" :loading :count="pullRequests.length" />
    <LoadingSpinner v-if="loading" />
    <div v-else class="space-y-4">
      <PullRequestCard
        v-for="pr in filter ? pullRequests.slice(0, props.filter) : pullRequests"
        :key="pr.id"
        :pull-request="pr"
        :detailed
      />
    </div>
  </section>
</template>
