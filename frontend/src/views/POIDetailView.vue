<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchPOIById, updatePOI, deletePOI, createPOI, POI } from '@/api/pois';
import { useToast } from 'vue-toastification';
import LoadingSpinner from '@/components/utils/LoadingSpinner.vue';
import POIBasicInfo from '@/components/pois/POIBasicInfo.vue';
import POILocationInfo from '@/components/pois/POILocationInfo.vue';
import POIARConfig from '@/components/pois/POIARConfig.vue';
import POINFTConfig from '@/components/pois/POINFTConfig.vue';
import POIActionButtons from '@/components/pois/POIActionButtons.vue';
import POI3DModelViewer from '@/components/pois/POI3DModelViewer.vue';
import POIARQrCode from '@/components/pois/POIARQrCode.vue';
import NFTImageModal from '@/components/pois/POINFTImageModal.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const originalPoi = ref<POI | null>(null);
const editedPoi = ref<POI | null>(null);
const poi = ref<POI | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const isEditing = ref(false);
const isSaving = ref(false);
const isDeleting = ref(false);
const showNFTModal = ref(false);

const routeId = computed(() => route.params.routeId as string);
const poiId = computed(() => route.params.poiId as string);

const isNewPoi = computed(() => poiId.value === 'new');

const nftImages = computed(() => {
  if (!poi.value || !poi.value.ar.nft) return [];
  return poi.value.ar.nft.map((nft) => ({
    id: nft.id,
    url: `https://raw.githubusercontent.com/${import.meta.env.VITE_GH_OWNER}/${import.meta.env.VITE_GH_REPO}/main/src/${routeId.value}/ar-media/images/${nft.id}`,
  }));
});

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

const openNFTModal = () => {
  showNFTModal.value = true;
};

const closeNFTModal = () => {
  showNFTModal.value = false;
};

const imageUrl = computed(() => {
  if (!poi.value) return '';
  return `https://raw.githubusercontent.com/${import.meta.env.VITE_GH_OWNER}/${
    import.meta.env.VITE_GH_REPO
  }/main/src/${routeId.value}/images/${poi.value.image}`;
});

const modelUrls = computed(() => {
  const models = poi.value?.ar.nft
    .filter((nft) => nft.type === 'model')
    .map((nft) => ({
      name: nft.name,
      url: `https://raw.githubusercontent.com/${import.meta.env.VITE_GH_OWNER}/${
        import.meta.env.VITE_GH_REPO
      }/main/src/${routeId.value}/ar-media/models/${nft.model}.glb`,
    }));

  return models || [];
});
</script>

<template>
  <div>
    <LoadingSpinner v-if="loading" />
    <div v-else-if="poi && editedPoi" class="rounded-lg border bg-gray-100 p-6">
      <h1 class="mb-4 text-3xl font-semibold">{{ poi.title }}</h1>

      <div class="mb-4 flex flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
        <div class="w-full lg:w-1/2">
          <img :src="imageUrl" :alt="poi.title" class="h-auto w-full rounded object-cover" />
        </div>

        <div class="flex w-full flex-col justify-start space-y-4 lg:w-1/2">
          <div class="space-y-4">
            <POIARQrCode />
            <div class="rounded-lg border bg-white p-4 shadow-md">
              <h3 class="mb-2 text-lg font-semibold">Beschreibung</h3>
              <p class="text-sm text-gray-600">{{ poi.arDesc }}</p>
            </div>
            <button
              @click="openNFTModal"
              class="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              NFT-Bilder anzeigen
            </button>
          </div>
        </div>
      </div>

      <POI3DModelViewer v-if="modelUrls.length > 0" :models="modelUrls" />

      <form @submit.prevent="savePOI">
        <POIBasicInfo v-model:editedPoi="editedPoi" :isEditing="isEditing" :isSaving="isSaving" />

        <POILocationInfo
          v-model:editedPoi="editedPoi"
          :isEditing="isEditing"
          :isSaving="isSaving"
        />

        <POIARConfig v-model:editedPoi="editedPoi" :isEditing="isEditing" :isSaving="isSaving" />

        <POINFTConfig v-model:editedPoi="editedPoi" :isEditing="isEditing" :isSaving="isSaving" />

        <POIActionButtons
          :isEditing="isEditing"
          :isNewPoi="isNewPoi"
          :isSaving="isSaving"
          :isDeleting="isDeleting"
          @toggle-edit="toggleEdit"
          @delete-poi="deletePOIHandler"
        />
      </form>
    </div>

    <NFTImageModal v-if="showNFTModal" :images="nftImages" @close="closeNFTModal" />
  </div>
</template>
