<script setup lang="ts">
import { computed, PropType } from 'vue';
import { PullRequest } from '@/api/pullRequests';

defineProps({
  pullRequest: {
    type: Object as PropType<PullRequest>,
    required: true,
  },
  detailed: {
    type: Boolean,
    default: false,
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
  <div
    class="changes-card rounded-lg border-l-8 border-blue-500 bg-gray-100 p-4 py-6 transition-colors"
  >
    <div class="flex justify-between">
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
    </div>
    <div v-if="detailed">
      <hr class="my-4 h-px border-0 bg-gray-300" />
      <div>
        <p>{{ pullRequest.files[0].filename }}</p>
      </div>
      <div class="mt-4">
        <a
          :href="`${pullRequest.html_url}/files`"
          target="_blank"
          title="Auf Github anzeigen"
          class="mr-2 rounded bg-gray-900 px-4 py-[10px] text-white hover:bg-gray-700"
        >
          <span class="pi pi-github"></span>
        </a>
        <button
          class="mr-2 rounded bg-blue-500 p-2 px-4 text-white hover:bg-blue-600 active:bg-blue-700"
        >
          Annehmen
        </button>
        <button class="mr-2 rounded bg-gray-200 p-2 px-4 hover:bg-gray-300 active:bg-blue-700">
          Ablehnen
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.changes-card:hover .self-center {
  transform: translateX(-10px);
}
</style>
