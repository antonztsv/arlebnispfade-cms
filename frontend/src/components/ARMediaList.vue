<script setup lang="ts">
import { PropType, ref } from 'vue';
import { addARMedia, deleteARMedia, ARMedia } from '@/api/arMedia';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

const toast = useToast();

const route = useRoute();
const routeId = route.params.routeId as string;
const loading = ref(false);
const deletingMedia = ref<string | null>(null);

const githubOwner = import.meta.env.VITE_GH_OWNER as string;
const githubRepo = import.meta.env.VITE_GH_REPO as string;

defineProps({
  arMedia: {
    type: Array as PropType<ARMedia[]>,
    required: true,
  },
});

const handleARMediaUpload = async (event: Event) => {
  loading.value = true;
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    try {
      await addARMedia(routeId, input.files[0]);
      toast.success('Änderung erfolgreich gespeichert');
    } catch (error) {
      console.error('Error uploading AR media:', error);
      toast.error('Änderung konnte nicht gespeichert werden');
    } finally {
      loading.value = false;
    }
  }
};

const handleARMediaDelete = async (media: ARMedia) => {
  loading.value = true;
  try {
    await deleteARMedia(routeId, media.id);
    toast.success('Änderung erfolgreich gespeichert');
  } catch (error) {
    console.error('Error deleting AR media:', error);
    toast.error('Änderung konnte nicht gespeichert werden');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <LoadingSpinner v-if="loading" />
  <div v-else>
    <input type="file" @change="handleARMediaUpload" class="hidden" id="ar-media-upload" />
    <label
      for="ar-media-upload"
      class="block cursor-pointer rounded bg-blue-500 p-2 px-4 text-center text-white hover:bg-blue-600 active:bg-blue-700"
      ><span class="pi pi-upload mr-2 text-sm"></span> Hinzufügen</label
    >

    <div class="mt-4 space-y-4">
      <div
        v-for="media in arMedia"
        :key="media.id"
        class="rounded-lg border-l-8 border-blue-500 bg-gray-100 p-4"
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
          :src="`https://raw.githubusercontent.com/${githubOwner}/${githubRepo}/main/${media.url}`"
        />
      </div>
    </div>
  </div>
</template>
