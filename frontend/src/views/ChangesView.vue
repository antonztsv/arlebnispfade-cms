<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchPullRequests, PullRequest } from '@/api/pullRequests';

const pullRequests = ref<PullRequest[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    pullRequests.value = await fetchPullRequests();
  } catch (e) {
    error.value = 'Fehler beim Laden der Änderungen. Bitte versuchen Sie es später erneut.';
    console.error('Error fetching pull requests:', e);
  } finally {
    loading.value = false;
  }
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
  <div class="container mx-auto px-4 py-8">
    <h1 class="mb-6 text-3xl font-bold">Alle Änderungen</h1>
    <div v-if="loading" class="text-center">
      <p>Lade Änderungen...</p>
    </div>
    <div v-else-if="error" class="text-center text-red-600">
      <p>{{ error }}</p>
    </div>
    <div v-else>
      <div v-for="pr in pullRequests" :key="pr.id" class="mb-4 rounded-lg bg-white p-6 shadow-md">
        <h2 class="mb-2 text-xl font-semibold">{{ pr.title }}</h2>
        <p class="mb-4 text-gray-600">{{ pr.description }}</p>
        <div class="flex justify-between text-sm text-gray-500">
          <span>Status: {{ pr.state }}</span>
          <span>Erstellt am: {{ formatDate(pr.created_at) }}</span>
        </div>
        <div class="mt-4">
          <a :href="pr.html_url" target="_blank" class="text-blue-500 hover:underline">
            Auf GitHub anzeigen
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
