<script setup lang="ts">
import { PropType, ref } from 'vue';
import { PullRequest } from '@/api/pullRequests';
import { mergePullRequest, closePullRequest } from '@/api/pullRequests';
import { useToast } from 'vue-toastification';

const toast = useToast();

const mergingPR = ref(false);
const closingPR = ref(false);

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

const emit = defineEmits(['prUpdated']);

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const mergePR = async (pullRequestNumber: number) => {
  mergingPR.value = true;
  try {
    await mergePullRequest(pullRequestNumber);
    toast.success('Änderung erfolgreich angenommen');
    emit('prUpdated', pullRequestNumber);
  } catch (error) {
    console.error('Error merging pull request:', error);
    toast.error('Fehler beim Annehmen der Änderung');
  } finally {
    mergingPR.value = false;
  }
};

const closePR = async (pullRequestNumber: number) => {
  closingPR.value = true;
  try {
    await closePullRequest(pullRequestNumber);
    toast.success('Änderung erfolgreich gelöscht');
    emit('prUpdated', pullRequestNumber);
  } catch (error) {
    console.error('Error closing pull request:', error);
    toast.error('Fehler beim Löschen der Änderung');
  } finally {
    closingPR.value = false;
  }
};
</script>

<template>
  <!-- normal view -->
  <RouterLink
    v-if="!detailed"
    to="/changes"
    class="changes-card flex justify-between rounded-lg border border-l-8 border-l-blue-500 bg-gray-100 p-4 py-6 transition-colors hover:bg-gray-200"
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

  <!-- detailed view -->
  <div
    v-else
    class="changes-card rounded-lg border border-l-8 border-l-blue-500 bg-gray-100 p-4 py-6 transition-colors"
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
    <div>
      <hr class="my-4 h-px border-0 bg-gray-300" />
      <!-- https://flowbite.com/docs/typography/hr/ -->
      <div>
        <p>{{ pullRequest.files[0].filename }}</p>
      </div>
      <div class="mt-4 flex">
        <a
          :href="`${pullRequest.html_url}/files`"
          target="_blank"
          title="Auf Github anzeigen"
          class="mr-2 rounded bg-gray-900 px-4 py-[10px] text-white hover:bg-gray-700 active:bg-gray-800"
        >
          <span class="pi pi-github"></span>
        </a>
        <button
          :class="[
            'mr-2 rounded bg-blue-500 p-2 px-4 text-white disabled:text-gray-200',
            { 'cursor-not-allowed': mergingPR },
            { 'hover:bg-blue-600 active:bg-blue-700': !mergingPR },
          ]"
          @click="mergePR(pullRequest.number)"
          :disabled="mergingPR || closingPR"
        >
          <span v-if="mergingPR" class="pi pi-spin pi-spinner mr-2"></span>
          <span v-else class="pi pi-save mr-2"></span>
          {{ mergingPR ? 'Wird angenommen...' : 'Annehmen' }}
        </button>
        <button
          :class="[
            'mr-2 rounded bg-gray-200 p-2 px-4 disabled:text-gray-400',
            { 'cursor-not-allowed': closingPR },
            { 'hover:bg-gray-300 active:bg-gray-400': !closingPR },
          ]"
          @click="closePR(pullRequest.number)"
          :disabled="mergingPR || closingPR"
        >
          <span v-if="closingPR" class="pi pi-spin pi-spinner mr-2"></span>
          <span v-else class="pi pi-trash mr-2"></span>
          {{ closingPR ? 'Wird gelöscht...' : 'Löschen' }}
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
