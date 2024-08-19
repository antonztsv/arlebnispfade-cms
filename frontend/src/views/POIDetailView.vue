<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchPOIById, updatePOI, deletePOI, createPOI, POI } from '@/api/pois';
import { useToast } from 'vue-toastification';
import LoadingSpinner from '@/components/utils/LoadingSpinner.vue';

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

const isNewPoi = computed(() => poiId.value === 'new');

onMounted(async () => {
  if (isNewPoi.value) {
    initializeNewPoi();
  } else {
    await loadPOI();
  }
});

const initializeNewPoi = () => {
  const newPoi: POI = {
    id: '',
    title: 'Neuer POI',
    image: '',
    layout: 'poi',
    type: '',
    gmaps: null,
    coords: [0, 0],
    info: '',
    arDesc: '',
    ar: {
      type: '',
      content: '',
      location: '',
      audio: undefined,
      video: [],
      model: [],
      nft: [],
    },
  };
  originalPoi.value = JSON.parse(JSON.stringify(newPoi));
  poi.value = JSON.parse(JSON.stringify(newPoi));
  editedPoi.value = JSON.parse(JSON.stringify(newPoi));
  isEditing.value = true;
  loading.value = false;
};

const loadPOI = async () => {
  loading.value = true;
  error.value = null;
  try {
    const fetchedPOI = await fetchPOIById(routeId.value, poiId.value);
    originalPoi.value = JSON.parse(JSON.stringify(fetchedPOI));
    poi.value = JSON.parse(JSON.stringify(fetchedPOI));
    editedPoi.value = JSON.parse(JSON.stringify(fetchedPOI));
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
    editedPoi.value = JSON.parse(JSON.stringify(poi.value));
  }
};

const savePOI = async () => {
  if (!editedPoi.value) return;

  isSaving.value = true;
  try {
    let savedPoi: POI;
    if (isNewPoi.value) {
      savedPoi = await createPOI(routeId.value, editedPoi.value);
      toast.success('Neuer POI erfolgreich erstellt');
    } else {
      savedPoi = await updatePOI(routeId.value, poiId.value, editedPoi.value);
      toast.success('Änderungen erfolgreich gespeichert');
    }
    isEditing.value = false;
    originalPoi.value = JSON.parse(JSON.stringify(savedPoi));
    poi.value = JSON.parse(JSON.stringify(savedPoi));
    editedPoi.value = JSON.parse(JSON.stringify(savedPoi));
    if (isNewPoi.value) {
      router.replace({
        name: 'poi-detail',
        params: { routeId: routeId.value, poiId: savedPoi.id },
      });
    }
  } catch (e) {
    console.error('Error saving POI:', e);
    toast.error('Fehler beim Speichern des POI');
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

// AR Configuration Methods
const addAudio = () => {
  if (editedPoi.value && !editedPoi.value.ar.audio) {
    editedPoi.value.ar.audio = { filename: '' };
  }
};

const removeAudio = () => {
  if (editedPoi.value) {
    editedPoi.value.ar.audio = undefined;
  }
};

const addVideo = () => {
  if (editedPoi.value) {
    if (!editedPoi.value.ar.video) {
      editedPoi.value.ar.video = [];
    }
    editedPoi.value.ar.video.push({ type: 'filename', filename: '' });
  }
};

const removeVideo = (index: number) => {
  if (editedPoi.value && editedPoi.value.ar.video) {
    editedPoi.value.ar.video.splice(index, 1);
  }
};

const addModel = () => {
  if (editedPoi.value) {
    if (!editedPoi.value.ar.model) {
      editedPoi.value.ar.model = [];
    }
    editedPoi.value.ar.model.push({ type: '', url: '' });
  }
};

const removeModel = (index: number) => {
  if (editedPoi.value && editedPoi.value.ar.model) {
    editedPoi.value.ar.model.splice(index, 1);
  }
};

const addNFT = () => {
  if (editedPoi.value) {
    editedPoi.value.ar.nft.push({
      type: '',
      id: '',
      name: '',
      model: '',
      position: '',
      rotation: '',
      scale: '',
    });
  }
};

const removeNFT = (index: number) => {
  if (editedPoi.value) {
    editedPoi.value.ar.nft.splice(index, 1);
  }
};
</script>

<template>
  <div>
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
            class="w-full rounded border border-gray-300 p-2 disabled:bg-inherit"
            required
          >
            <option value="poi">poi</option>
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

        <!-- AR Configuration -->
        <div class="ar-config-form mb-4">
          <h3 class="mb-4 text-xl font-semibold">AR Konfiguration</h3>

          <!-- AR Type -->
          <div class="mb-4">
            <label for="ar-type" class="mb-1 block text-sm font-medium text-gray-700">AR Typ</label>
            <select
              id="ar-type"
              v-model="editedPoi.ar.type"
              :disabled="!isEditing || isSaving"
              class="w-full rounded border border-gray-300 p-2 disabled:bg-inherit"
            >
              <option value="image-tracking">Image Tracking</option>
              <option value="location-based">Location Based</option>
            </select>
          </div>

          <!-- AR Content -->
          <div class="mb-4">
            <label for="ar-content" class="mb-1 block text-sm font-medium text-gray-700"
              >AR Inhalt</label
            >
            <select
              id="ar-content"
              v-model="editedPoi.ar.content"
              :disabled="!isEditing || isSaving"
              class="w-full rounded border border-gray-300 p-2 disabled:bg-inherit"
            >
              <option value="audio">Audio</option>
              <option value="video">Video</option>
              <option value="model">3D Model</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>

          <!-- AR Location -->
          <div class="mb-4">
            <label for="ar-location" class="mb-1 block text-sm font-medium text-gray-700"
              >AR Standort</label
            >
            <input
              id="ar-location"
              v-model="editedPoi.ar.location"
              :disabled="!isEditing || isSaving"
              type="text"
              class="w-full rounded border border-gray-300 p-2"
            />
          </div>

          <!-- Audio Configuration -->
          <div class="mb-4">
            <label class="mb-1 block text-sm font-medium text-gray-700">Audio</label>
            <div v-if="editedPoi.ar.audio" class="mt-2 flex items-center">
              <input
                v-model="editedPoi.ar.audio.filename"
                :disabled="!isEditing || isSaving"
                type="text"
                placeholder="Audiodateiname"
                class="mr-2 w-full rounded border border-gray-300 p-2"
              />
              <button
                @click="removeAudio"
                :disabled="!isEditing || isSaving"
                class="rounded bg-red-500 p-2 px-4 text-white hover:bg-red-600 disabled:bg-gray-400"
                :class="{ hidden: !isEditing }"
                type="button"
              >
                Entfernen
              </button>
            </div>
            <button
              v-if="!editedPoi.ar.audio"
              @click="addAudio"
              :disabled="!isEditing || isSaving"
              class="mt-2 rounded bg-blue-500 p-2 px-4 text-white hover:bg-blue-600 disabled:bg-gray-400"
              :class="{ hidden: !isEditing }"
              type="button"
            >
              Audio hinzufügen
            </button>
          </div>

          <!-- Video Configuration -->
          <div class="mb-4">
            <label class="mb-1 block text-sm font-medium text-gray-700">Video</label>
            <template v-if="editedPoi.ar.video">
              <div
                v-for="(video, index) in editedPoi.ar.video"
                :key="index"
                class="mt-2 flex items-center"
              >
                <select
                  v-model="video.type"
                  :disabled="!isEditing || isSaving"
                  class="mr-2 rounded border border-gray-300 p-2 disabled:bg-inherit"
                >
                  <option value="filename">Dateiname</option>
                  <option value="url">URL</option>
                </select>
                <input
                  v-if="video.type === 'filename'"
                  v-model="video.filename"
                  :disabled="!isEditing || isSaving"
                  type="text"
                  placeholder="Videodateiname"
                  class="mr-2 w-full rounded border border-gray-300 p-2"
                />
                <input
                  v-else
                  v-model="video.url"
                  :disabled="!isEditing || isSaving"
                  type="text"
                  placeholder="Video-URL"
                  class="mr-2 w-full rounded border border-gray-300 p-2"
                />
                <button
                  @click="removeVideo(index)"
                  :disabled="!isEditing || isSaving"
                  class="rounded bg-red-500 p-2 px-4 text-white hover:bg-red-600 disabled:bg-gray-400"
                  :class="{ hidden: !isEditing }"
                  type="button"
                >
                  Entfernen
                </button>
              </div>
            </template>
            <button
              @click="addVideo"
              :disabled="!isEditing || isSaving"
              class="mt-2 rounded bg-blue-500 p-2 px-4 text-white hover:bg-blue-600 disabled:bg-gray-400"
              :class="{ hidden: !isEditing }"
              type="button"
            >
              Video hinzufügen
            </button>
          </div>

          <!-- 3D Model Configuration -->
          <div class="mb-4">
            <label class="mb-1 block text-sm font-medium text-gray-700">3D Model</label>
            <template v-if="editedPoi.ar.model">
              <div
                v-for="(model, index) in editedPoi.ar.model"
                :key="index"
                class="mt-2 flex items-center"
              >
                <input
                  v-model="model.type"
                  :disabled="!isEditing || isSaving"
                  type="text"
                  placeholder="Modelltyp"
                  class="mr-2 w-full rounded border border-gray-300 p-2"
                />
                <input
                  v-model="model.url"
                  :disabled="!isEditing || isSaving"
                  type="text"
                  placeholder="Modell-URL"
                  class="mr-2 w-full rounded border border-gray-300 p-2"
                />
                <button
                  @click="removeModel(index)"
                  :disabled="!isEditing || isSaving"
                  class="rounded bg-red-500 p-2 px-4 text-white hover:bg-red-600 disabled:bg-gray-400"
                  :class="{ hidden: !isEditing }"
                  type="button"
                >
                  Entfernen
                </button>
              </div>
            </template>
            <button
              @click="addModel"
              :disabled="!isEditing || isSaving"
              class="mt-2 rounded bg-blue-500 p-2 px-4 text-white hover:bg-blue-600 disabled:bg-gray-400"
              :class="{ hidden: !isEditing }"
              type="button"
            >
              3D Model hinzufügen
            </button>
          </div>
        </div>

        <!-- NFT Configuration -->
        <div class="mb-4">
          <label class="mb-1 block text-sm font-medium text-gray-700">NFT</label>
          <div
            v-for="(nft, index) in editedPoi.ar.nft"
            :key="index"
            class="mt-2 rounded border p-2"
          >
            <div class="mb-2 flex items-center">
              <input
                v-model="nft.type"
                :disabled="!isEditing || isSaving"
                type="text"
                placeholder="NFT-Typ"
                class="mr-2 w-full rounded border border-gray-300 p-2"
              />
              <input
                v-model="nft.id"
                :disabled="!isEditing || isSaving"
                type="text"
                placeholder="NFT-ID"
                class="mr-2 w-full rounded border border-gray-300 p-2"
              />
              <input
                v-model="nft.name"
                :disabled="!isEditing || isSaving"
                type="text"
                placeholder="NFT-Name"
                class="mr-2 w-full rounded border border-gray-300 p-2"
              />
            </div>
            <div class="mb-2 flex items-center">
              <input
                v-model="nft.model"
                :disabled="!isEditing || isSaving"
                type="text"
                placeholder="NFT-Modell"
                class="mr-2 w-full rounded border border-gray-300 p-2"
              />
              <input
                v-model="nft.position"
                :disabled="!isEditing || isSaving"
                type="text"
                placeholder="Position"
                class="mr-2 w-full rounded border border-gray-300 p-2"
              />
            </div>
            <div class="flex items-center">
              <input
                v-model="nft.rotation"
                :disabled="!isEditing || isSaving"
                type="text"
                placeholder="Rotation"
                class="mr-2 w-full rounded border border-gray-300 p-2"
              />
              <input
                v-model="nft.scale"
                :disabled="!isEditing || isSaving"
                type="text"
                placeholder="Skalierung"
                class="mr-2 w-full rounded border border-gray-300 p-2"
              />
              <button
                @click="removeNFT(index)"
                :disabled="!isEditing || isSaving"
                class="rounded bg-red-500 p-2 px-4 text-white hover:bg-red-600 disabled:bg-gray-400"
                :class="{ hidden: !isEditing }"
                type="button"
              >
                Entfernen
              </button>
            </div>
          </div>
          <button
            @click="addNFT"
            :disabled="!isEditing || isSaving"
            class="mt-2 rounded bg-blue-500 p-2 px-4 text-white hover:bg-blue-600 disabled:bg-gray-400"
            :class="{ hidden: !isEditing }"
            type="button"
          >
            NFT hinzufügen
          </button>
        </div>

        <!-- Action Buttons -->
        <div class="mt-6 space-x-2">
          <template v-if="!isEditing">
            <button
              v-if="!isEditing && !isNewPoi"
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
              v-if="isEditing || isNewPoi"
              @click="savePOI"
              type="submit"
              :disabled="isSaving || isDeleting"
              class="rounded bg-blue-500 p-2 px-4 text-white hover:bg-blue-600 active:bg-blue-700 disabled:bg-gray-400"
            >
              <span v-if="isSaving" class="pi pi-spin pi-spinner mr-1"></span>
              <span v-else class="pi pi-save mr-1"></span>
              {{ isSaving ? 'Speichert...' : 'Speichern' }}
            </button>
            <button
              v-if="isEditing && !isNewPoi"
              @click="toggleEdit"
              type="button"
              :disabled="isSaving || isDeleting"
              class="rounded bg-gray-200 p-2 px-4 hover:bg-gray-300 active:bg-gray-400 disabled:bg-gray-100"
            >
              Abbrechen
            </button>
            <button
              v-if="!isNewPoi"
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
