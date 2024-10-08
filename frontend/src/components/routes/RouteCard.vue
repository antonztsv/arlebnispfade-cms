<script setup lang="ts">
import { computed, PropType, ref } from 'vue';
import { updateRoute, Route } from '@/api/routes';
import LoadingSpinner from '@/components/utils/LoadingSpinner.vue';
import { useToast } from 'vue-toastification';

const toast = useToast();

const props = defineProps({
  route: {
    type: Object as PropType<Route>,
    required: true,
  },
  editable: {
    type: Boolean,
    default: false,
  },
});

const isEditing = ref(false);
const editedRoute = ref({ ...props.route });
const isSaving = ref(false);
const error = ref<string | null>(null);

const imageUrl = computed(
  () =>
    `https://raw.githubusercontent.com/${import.meta.env.VITE_GH_OWNER}/${import.meta.env.VITE_GH_REPO}/main/src/${props.route.id}/images/small/${props.route.image}`,
);

const cardLink = computed(() => ({
  name: 'route-detail',
  params: { routeId: props.route.id },
}));

const toggleEdit = () => {
  if (isEditing.value) {
    editedRoute.value = { ...props.route };
  }
  isEditing.value = !isEditing.value;
  error.value = null;
};

const saveChanges = async () => {
  isSaving.value = true;
  error.value = null;
  try {
    await updateRoute(editedRoute.value);
    isEditing.value = false;
    toast.success('Änderungen erfolgreich gespeichert');
  } catch (err) {
    error.value = 'Fehler beim Speichern der Änderungen. Bitte versuchen Sie es erneut.';
    console.error('Error updating route:', err);
    toast.error('Fehler beim Speichern der Änderungen');
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <!-- Card on Home -->
  <RouterLink v-if="!editable" :to="cardLink" class="route-card overflow-hidden rounded-lg">
    <div class="relative h-64 overflow-hidden">
      <div
        class="absolute inset-0 bg-cover bg-center transition-transform duration-300 ease-in-out"
        :style="{
          backgroundImage: `url(${imageUrl})`,
        }"
      ></div>
      <div
        class="absolute inset-0 bg-black opacity-30 transition-opacity duration-300 ease-in-out"
      ></div>

      <h3
        class="absolute bottom-4 left-4 text-lg font-semibold text-white transition-transform duration-300 ease-in-out"
      >
        {{ route.title }}
      </h3>
    </div>
  </RouterLink>

  <!-- Card on Route View -->
  <div v-else class="grid grid-cols-1 rounded-lg border bg-gray-100 lg:grid-cols-2">
    <RouterLink
      :to="cardLink"
      class="route-card overflow-hidden rounded-lg rounded-b-none md:rounded-b-lg lg:rounded-b-lg"
    >
      <div class="relative h-full min-h-64 overflow-hidden">
        <div
          class="absolute inset-0 bg-cover bg-center transition-transform duration-300 ease-in-out"
          :style="{
            backgroundImage: `url(${imageUrl})`,
          }"
        ></div>
        <div
          class="absolute inset-0 bg-black opacity-30 transition-opacity duration-300 ease-in-out"
        ></div>

        <h3
          class="absolute bottom-4 left-4 text-lg font-semibold text-white transition-transform duration-300 ease-in-out"
        >
          {{ route.title }}
        </h3>
      </div>
    </RouterLink>
    <div class="p-4">
      <div>
        <div class="mb-4">
          <label for="route-title" class="mb-1 block text-sm font-medium text-gray-700"
            >Titel</label
          >
          <input
            id="route-title"
            v-model="editedRoute.title"
            :disabled="isSaving || !isEditing"
            class="w-full rounded border border-gray-300 p-2"
          />
        </div>

        <div class="mb-4">
          <label for="route-layout" class="mb-1 block text-sm font-medium text-gray-700"
            >Layout</label
          >
          <input
            id="route-layout"
            v-model="editedRoute.layout"
            :disabled="isSaving || !isEditing"
            class="w-full rounded border border-gray-300 p-2"
          />
        </div>

        <div class="mb-4">
          <label for="route-image" class="mb-1 block text-sm font-medium text-gray-700">Bild</label>
          <input
            id="route-image"
            v-model="editedRoute.image"
            :disabled="isSaving || !isEditing"
            class="w-full rounded border border-gray-300 p-2"
          />
        </div>

        <div class="mb-4">
          <label for="route-type" class="mb-1 block text-sm font-medium text-gray-700">Typ</label>
          <input
            id="route-type"
            v-model="editedRoute.type"
            :disabled="isSaving || !isEditing"
            class="w-full rounded border border-gray-300 p-2"
          />
        </div>

        <button
          v-if="!isEditing"
          @click="toggleEdit"
          class="mr-2 rounded bg-blue-500 p-2 px-4 text-white hover:bg-blue-600 active:bg-blue-700"
        >
          <span class="pi pi-file-edit mr-1"></span> Bearbeiten
        </button>
        <button
          v-if="isEditing"
          @click="saveChanges"
          :disabled="isSaving"
          class="mr-2 rounded bg-blue-500 p-2 px-4 text-white hover:bg-blue-600 active:bg-blue-700 disabled:bg-blue-300"
        >
          <span v-if="isSaving" class="pi pi-spin pi-spinner mr-1"></span>
          <span v-else class="pi pi-save mr-1"></span>
          {{ isSaving ? 'Speichert...' : 'Speichern' }}
        </button>
        <button
          v-if="isEditing"
          @click="toggleEdit"
          :disabled="isSaving"
          class="rounded bg-gray-200 p-2 px-4 hover:bg-gray-300 active:bg-gray-400 disabled:bg-gray-100"
        >
          Abbrechen
        </button>
        <p v-if="error" class="mt-2 text-red-500">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.route-card:hover .bg-cover {
  transform: scale(1.1);
}

.route-card:hover .bg-black {
  opacity: 0.5;
}

.route-card:hover h3 {
  transform: translateY(-10px);
}
</style>
