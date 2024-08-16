<script setup lang="ts">
import { computed, PropType, ref } from 'vue';
import { addARMedia, deleteARMedia, ARMedia } from '@/api/arMedia';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';

const githubOwner = import.meta.env.VITE_GH_OWNER as string;
const githubRepo = import.meta.env.VITE_GH_REPO as string;

const toast = useToast();

const route = useRoute();
const routeId = route.params.routeId as string;
const deletingMedia = ref<string | null>(null);
const uploadingMedia = ref<File | null>(null);
const selectedMediaType = ref<string>('');

const mediaTypes = ['audios', 'images', 'videos', 'models'];

defineProps({
  arMedia: {
    type: Array as PropType<ARMedia[]>,
    required: true,
  },
});

const isUploadDisabled = computed(() => {
  return uploadingMedia.value !== null || !selectedMediaType.value;
});

const resetUploadState = () => {
  uploadingMedia.value = null;
  selectedMediaType.value = '';
  // Reset the file input
  const fileInput = document.getElementById('ar-media-upload') as HTMLInputElement;
  if (fileInput) {
    fileInput.value = '';
  }
};

const handleARMediaUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0] && selectedMediaType.value) {
    try {
      uploadingMedia.value = input.files[0];
      await addARMedia(routeId, input.files[0], selectedMediaType.value);
      toast.success('Änderung erfolgreich gespeichert');
    } catch (error) {
      console.error('Error uploading AR media:', error);
      toast.error('Änderung konnte nicht gespeichert werden');
    } finally {
      resetUploadState();
    }
  } else {
    toast.error('Bitte wählen Sie einen Medientyp aus');
  }
};

const handleARMediaDelete = async (media: ARMedia) => {
  try {
    deletingMedia.value = media.id;
    await deleteARMedia(routeId, media.id);
    toast.success('Änderung erfolgreich gespeichert');
  } catch (error) {
    console.error('Error deleting AR media:', error);
    toast.error('Änderung konnte nicht gespeichert werden');
  } finally {
    deletingMedia.value = null;
  }
};
</script>

<template>
  <div>
    <div class="rounded-lg border bg-gray-100 p-4">
      <input
        type="file"
        @change="handleARMediaUpload"
        class="hidden"
        id="ar-media-upload"
        :disabled="isUploadDisabled"
      />
      <label
        for="ar-media-upload"
        class="mb-4 block cursor-pointer rounded bg-blue-500 p-2 px-4 text-center text-white transition-colors duration-200"
        :class="{
          'hover:bg-blue-600 active:bg-blue-700': !isUploadDisabled,
          'cursor-not-allowed bg-gray-400': isUploadDisabled,
        }"
      >
        <span v-if="uploadingMedia" class="pi pi-spin pi-spinner mr-2"></span>
        <span v-else class="pi pi-upload mr-2 text-sm"></span>
        {{ uploadingMedia ? 'Lädt...' : 'Hinzufügen' }}
      </label>

      <select
        v-model="selectedMediaType"
        class="block w-full rounded border border-gray-300 p-2"
        :disabled="uploadingMedia !== null"
      >
        <option value="" disabled>Medientyp auswählen</option>
        <option v-for="type in mediaTypes" :key="type" :value="type">
          {{ type.charAt(0).toUpperCase() + type.slice(1) }}
        </option>
      </select>
    </div>

    <hr class="my-4 border-gray-300" />

    <div class="mt-4 space-y-4">
      <div
        v-for="media in arMedia"
        :key="media.id"
        class="rounded-lg border border-l-8 border-l-blue-500 bg-gray-100 p-4"
      >
        <div class="flex justify-between">
          <h3 class="font-semibold">{{ media.filename }}</h3>

          <div class="flex items-center space-x-2">
            <p class="flex text-sm text-gray-500">
              <span
                v-if="media.type === 'video'"
                class="pi pi-video text-md mr-2 self-center"
              ></span>
              <span
                v-else-if="media.type === 'audio'"
                class="pi pi-headphones text-md mr-2 self-center"
              ></span>
              <span
                v-else-if="media.type === 'image'"
                class="pi pi-image text-md mr-2 self-center"
              ></span>
              <span
                v-else-if="media.type === 'model'"
                class="pi pi-box text-md mr-2 self-center"
              ></span>
              {{ media.type }}
            </p>
            <button
              @click="handleARMediaDelete(media)"
              class="rounded bg-gray-200 p-1 px-2 hover:bg-red-500 hover:text-white active:bg-red-700"
              :disabled="deletingMedia === media.id"
            >
              <span v-if="deletingMedia === media.id" class="pi pi-spin pi-spinner"></span>
              <span v-else class="pi pi-trash"></span>
            </button>
          </div>
        </div>
        <p class="mt-2 text-sm text-gray-600">{{ media.url }}</p>
        <audio
          v-if="media.type === 'audio'"
          controls
          class="mt-4 w-full rounded-full border-2"
          :src="`https://raw.githubusercontent.com/${githubOwner}/${githubRepo}/main/${media.url}`"
        ></audio>
        <video
          v-else-if="media.type === 'video'"
          controls
          class="mt-4 w-full rounded"
          :src="`https://raw.githubusercontent.com/${githubOwner}/${githubRepo}/main/${media.url}`"
        ></video>
        <img
          v-else-if="
            media.type === 'image' &&
            !media.url.endsWith('.fset') &&
            !media.url.endsWith('.iset') &&
            !media.url.endsWith('.fset3')
          "
          class="mt-4 w-full rounded"
          :alt="media.filename"
          :src="`https://raw.githubusercontent.com/${githubOwner}/${githubRepo}/main/${media.url}`"
        />
      </div>
    </div>
  </div>
</template>
