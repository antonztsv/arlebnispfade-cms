<script setup lang="ts">
import { PropType } from 'vue';
import { PullRequest } from '@/api/pullRequests';

defineProps({
  pullRequest: {
    type: Object as PropType<PullRequest>,
    required: true,
  },
});

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
</script>

<template>
  <RouterLink
    :to="`/changes/${pullRequest.number}`"
    class="changes-card flex justify-between rounded-lg border-l-8 border-blue-500 bg-gray-100 p-4 py-6 transition-colors hover:bg-gray-200"
  >
    <div>
      <h3 class="font-semibold">
        <span class="text-gray-500">#{{ pullRequest.number }}</span>
        {{ pullRequest.title }}
      </h3>
      <p class="text-sm text-gray-500">
        {{ formatDate(pullRequest.created_at) }}
      </p>
    </div>
    <div
      class="self-center rounded-md transition-transform duration-300 ease-in-out hover:bg-gray-100"
    >
      <span class="pi pi-arrow-right-arrow-left text-lg"></span>
    </div>
  </RouterLink>
</template>

<style scoped>
.changes-card:hover .self-center {
  transform: translateX(-10px);
}
</style>
