<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { fetchPOIById, POI } from '@/api/pois';

const route = useRoute();
const poi = ref<POI | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const isEditing = ref(false);

const defaultPOI: POI = {
  id: '',
  title: '',
  image: '',
  layout: '',
  gmaps: null,
  coords: [0, 0],
  info: '',
  arDesc: '',
};

const editedPoi = ref<POI>(defaultPOI);

const routeId = computed(() => route.params.routeId as string);
const poiId = computed(() => route.params.poiId as string);

onMounted(async () => {
  await loadPOI();
});

const loadPOI = async () => {
  loading.value = true;
  error.value = null;
  try {
    const fetchedPOI = await fetchPOIById(routeId.value, poiId.value);
    poi.value = fetchedPOI;
    editedPoi.value = { ...fetchedPOI };
  } catch (e) {
    error.value = 'Fehler beim Laden des POI. Bitte versuchen Sie es später erneut.';
    console.error('Error fetching POI:', e);
  } finally {
    loading.value = false;
  }
};

const toggleEdit = () => {
  isEditing.value = !isEditing.value;
  if (!isEditing.value && poi.value) {
    editedPoi.value = { ...poi.value };
  }
};

const savePOI = async () => {
  // Todo: api call to save editedPoi
  if (poi.value) {
    poi.value = { ...editedPoi.value };
  }
  isEditing.value = false;
};
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="text-center">
      <p>Lade POI-Details...</p>
    </div>
    <div v-else-if="error" class="text-center text-red-600">
      <p>{{ error }}</p>
    </div>
    <div v-else-if="poi" class="rounded-lg bg-white p-6 shadow-lg">
      <div class="mb-6 flex items-center justify-between">
        <h1 class="text-3xl font-bold">{{ poi.title }}</h1>
        <button
          @click="toggleEdit"
          class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          {{ isEditing ? 'Abbrechen' : 'Bearbeiten' }}
        </button>
      </div>

      <div v-if="!isEditing">
        <img :src="poi.image" :alt="poi.title" class="mb-4 h-64 w-full rounded-lg object-cover" />
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <h2 class="mb-2 text-xl font-semibold">Information</h2>
            <p>{{ poi.info }}</p>
          </div>
          <div>
            <h2 class="mb-2 text-xl font-semibold">AR-Beschreibung</h2>
            <p>{{ poi.arDesc }}</p>
          </div>
        </div>
        <div v-if="poi.gmaps" class="mt-4">
          <a :href="poi.gmaps" target="_blank" class="text-blue-600 hover:underline">
            Auf Google Maps anzeigen
          </a>
        </div>
        <div v-if="poi.content" class="mt-4">
          <h2 class="mb-2 text-xl font-semibold">Zusätzlicher Inhalt</h2>
          <div v-html="poi.content"></div>
        </div>
      </div>

      <div v-else>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Titel</label>
            <input
              v-model="editedPoi.title"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Bild URL</label>
            <input
              v-model="editedPoi.image"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Information</label>
            <textarea
              v-model="editedPoi.info"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">AR-Beschreibung</label>
            <textarea
              v-model="editedPoi.arDesc"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Google Maps URL</label>
            <input
              v-model="editedPoi.gmaps"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Zusätzlicher Inhalt</label>
            <textarea
              v-model="editedPoi.content"
              rows="5"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            ></textarea>
          </div>
        </div>
        <div class="mt-6">
          <button
            @click="savePOI"
            class="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
