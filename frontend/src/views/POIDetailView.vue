<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchPOIById, updatePOI, deletePOI, POI } from '@/api/pois';
import { useToast } from 'vue-toastification';
import ArConfigForm from '@/components/ArConfigForm.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const originalPoi = ref<POI | null>(null);
const poi = ref<POI | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const isEditing = ref(false);
const isSaving = ref(false);
const isDeleting = ref(false);

const editedPoi = ref<POI | null>(null);

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
    originalPoi.value = JSON.parse(JSON.stringify(fetchedPOI)); // Deep clone
    poi.value = JSON.parse(JSON.stringify(fetchedPOI)); // Deep clone
    editedPoi.value = JSON.parse(JSON.stringify(fetchedPOI)); // Deep clone
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
    editedPoi.value = JSON.parse(JSON.stringify(poi.value)); // Reset to current POI when cancelling
  }
};

const savePOI = async () => {
  if (!editedPoi.value) return;

  isSaving.value = true;
  try {
    await updatePOI(routeId.value, poiId.value, editedPoi.value);
    isEditing.value = false;
    toast.success('Änderungen erfolgreich gespeichert');
    // Reset POI to its original state after saving
    poi.value = JSON.parse(JSON.stringify(originalPoi.value));
    editedPoi.value = JSON.parse(JSON.stringify(originalPoi.value));
  } catch (e) {
    console.error('Error updating POI:', e);
    toast.error('Fehler beim Aktualisieren des POI');
  } finally {
    isSaving.value = false;
  }
};

const deletePOIHandler = async () => {
  isDeleting.value = true;
  try {
    await deletePOI(routeId.value, poiId.value);
    toast.success('POI erfolgreich gelöscht');
    router.push({ name: 'route-detail', params: { routeId: routeId.value } });
  } catch (e) {
    console.error('Error deleting POI:', e);
    toast.error('Fehler beim Löschen des POI');
  } finally {
    isDeleting.value = false;
  }
};

const imageUrl = computed(() => {
  if (!poi.value) return '';
  return `https://raw.githubusercontent.com/${import.meta.env.VITE_GH_OWNER}/${
    import.meta.env.VITE_GH_REPO
  }/main/src/${routeId.value}/images/${poi.value.image}`;
});
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <LoadingSpinner v-if="loading" />
    <div v-else-if="poi && editedPoi" class="rounded-lg border bg-gray-100 p-6">
      <h1 class="mb-4 text-3xl font-semibold">{{ poi.title }}</h1>

      <img :src="imageUrl" :alt="poi.title" class="mb-6 w-1/2 rounded" />

      <form @submit.prevent="savePOI">
        <div class="mb-4">
          <label for="poi-title" class="mb-1 block text-sm font-medium text-gray-700">Titel</label>
          <input
            id="poi-title"
            v-model="editedPoi.title"
            :disabled="!isEditing || isSaving"
            class="w-full rounded border border-gray-300 p-2"
            required
          />
        </div>

        <div class="mb-4">
          <label for="poi-image" class="mb-1 block text-sm font-medium text-gray-700">Bild</label>
          <input
            id="poi-image"
            v-model="editedPoi.image"
            :disabled="!isEditing || isSaving"
            class="w-full rounded border border-gray-300 p-2"
            required
          />
        </div>

        <div class="mb-4">
          <label for="poi-type" class="mb-1 block text-sm font-medium text-gray-700">Typ</label>
          <input
            id="poi-type"
            v-model="editedPoi.type"
            :disabled="!isEditing || isSaving"
            class="w-full rounded border border-gray-300 p-2"
          />
        </div>

        <div class="mb-4">
          <label for="poi-layout" class="mb-1 block text-sm font-medium text-gray-700"
            >Layout</label
          >
          <select
            id="poi-layout"
            v-model="editedPoi.layout"
            :disabled="!isEditing || isSaving"
            class="w-full rounded border border-gray-300 p-2"
            required
          >
            <option value="poi">POI</option>
            <option value="route">Route</option>
          </select>
        </div>

        <div class="mb-4">
          <label for="poi-gmaps" class="mb-1 block text-sm font-medium text-gray-700"
            >Google Maps URL</label
          >
          <input
            id="poi-gmaps"
            v-model="editedPoi.gmaps"
            :disabled="!isEditing || isSaving"
            class="w-full rounded border border-gray-300 p-2"
            type="url"
          />
        </div>

        <div class="mb-4">
          <label for="poi-coords" class="mb-1 block text-sm font-medium text-gray-700"
            >Koordinaten</label
          >
          <div class="flex space-x-2">
            <input
              id="poi-coords-lat"
              v-model="editedPoi.coords[0]"
              :disabled="!isEditing || isSaving"
              class="w-1/2 rounded border border-gray-300 p-2"
              type="number"
              step="any"
              placeholder="Breitengrad"
            />
            <input
              id="poi-coords-lon"
              v-model="editedPoi.coords[1]"
              :disabled="!isEditing || isSaving"
              class="w-1/2 rounded border border-gray-300 p-2"
              type="number"
              step="any"
              placeholder="Längengrad"
            />
          </div>
        </div>

        <div class="mb-4">
          <label for="poi-info" class="mb-1 block text-sm font-medium text-gray-700">Info</label>
          <textarea
            id="poi-info"
            v-model="editedPoi.info"
            :disabled="!isEditing || isSaving"
            rows="5"
            class="w-full rounded border border-gray-300 p-2"
          ></textarea>
        </div>

        <div class="mb-4">
          <label for="poi-arDesc" class="mb-1 block text-sm font-medium text-gray-700"
            >AR Beschreibung</label
          >
          <textarea
            id="poi-arDesc"
            v-model="editedPoi.arDesc"
            :disabled="!isEditing || isSaving"
            rows="5"
            class="w-full rounded border border-gray-300 p-2"
          ></textarea>
        </div>

        <!-- AR Konfiguration -->
        <ArConfigForm
          v-if="editedPoi.ar"
          v-model:arConfig="editedPoi.ar"
          :isEditing="isEditing"
          :isSaving="isSaving"
        />

        <div class="mt-6 space-x-2">
          <template v-if="!isEditing">
            <button
              @click="toggleEdit"
              type="button"
              :disabled="isSaving || isDeleting"
              class="rounded bg-blue-500 p-2 px-4 text-white hover:bg-blue-600 active:bg-blue-700 disabled:bg-gray-400"
            >
              <span class="pi pi-file-edit mr-1"></span> Bearbeiten
            </button>
          </template>
          <template v-else>
            <button
              type="submit"
              :disabled="isSaving || isDeleting"
              class="rounded bg-blue-500 p-2 px-4 text-white hover:bg-blue-600 active:bg-blue-700 disabled:bg-gray-400"
            >
              <span v-if="isSaving" class="pi pi-spin pi-spinner mr-1"></span>
              <span v-else class="pi pi-save mr-1"></span>
              {{ isSaving ? 'Speichert...' : 'Speichern' }}
            </button>
            <button
              @click="toggleEdit"
              type="button"
              :disabled="isSaving || isDeleting"
              class="rounded bg-gray-200 p-2 px-4 hover:bg-gray-300 active:bg-gray-400 disabled:bg-gray-100"
            >
              Abbrechen
            </button>
            <button
              @click="deletePOIHandler"
              type="button"
              :disabled="isSaving || isDeleting"
              class="rounded bg-red-500 p-2 px-4 text-white hover:bg-red-600 active:bg-red-700 disabled:bg-gray-400"
            >
              <span v-if="isDeleting" class="pi pi-spin pi-spinner mr-1"></span>
              <span v-else class="pi pi-trash mr-1"></span>
              {{ isDeleting ? 'Löscht...' : 'Löschen' }}
            </button>
          </template>
        </div>
      </form>
    </div>
  </div>
</template>
