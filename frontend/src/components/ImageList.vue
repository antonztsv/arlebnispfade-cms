<script setup lang="ts">
import { computed, PropType, ref } from 'vue';
import { deleteImage, addImage, Image } from '@/api/images';
import { useToast } from 'vue-toastification';
import { useRoute } from 'vue-router';

const toast = useToast();

const route = useRoute();
const routeId = computed(() => route.params.routeId as string);
const deletingImage = ref<string | null>(null);
const uploadingImage = ref<File | null>(null);
const isSmallImage = ref(false);

const githubOwner = import.meta.env.VITE_GH_OWNER as string;
const githubRepo = import.meta.env.VITE_GH_REPO as string;

defineProps({
  images: {
    type: Array as PropType<Image[]>,
    required: true,
  },
});

const resetUploadState = () => {
  uploadingImage.value = null;
  isSmallImage.value = false;
  const fileInput = document.getElementById('image-upload') as HTMLInputElement;
  if (fileInput) {
    fileInput.value = '';
  }
};

const handleImageUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    try {
      uploadingImage.value = input.files[0];
      await addImage(routeId.value, input.files[0], isSmallImage.value);
      toast.success('Änderung erfolgreich gespeichert');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Änderung konnte nicht gespeichert werden');
    } finally {
      resetUploadState();
    }
  }
};

const handleImageDelete = async (image: Image) => {
  deletingImage.value = image.id;
  try {
    await deleteImage(routeId.value, image.id);
    toast.success('Änderung erfolgreich gespeichert');
  } catch (error) {
    console.error('Error deleting image:', error);
    toast.error('Änderung konnte nicht gespeichert werden');
  } finally {
    deletingImage.value = null;
  }
};
</script>

<template>
  <div>
    <div class="rounded-lg border bg-gray-100 p-4">
      <input
        type="file"
        @change="handleImageUpload"
        class="hidden"
        id="image-upload"
        :disabled="uploadingImage !== null"
      />

      <label
        for="image-upload"
        class="mb-4 block cursor-pointer rounded bg-blue-500 p-2 px-4 text-center text-white transition-colors duration-200"
        :class="{
          'hover:bg-blue-600 active:bg-blue-700': !uploadingImage,
          'cursor-not-allowed bg-gray-400': uploadingImage,
        }"
      >
        <span v-if="uploadingImage" class="pi pi-spin pi-spinner mr-2"></span>
        <span v-else class="pi pi-upload mr-2 text-sm"></span>
        {{ uploadingImage ? 'Lädt...' : 'Hinzufügen' }}
      </label>
      <div class="mb-0 flex items-center md:mb-5">
        <input
          type="checkbox"
          id="small-image"
          v-model="isSmallImage"
          class="mr-2"
          :disabled="uploadingImage !== null"
        />
        <label for="small-image" class="text-sm text-gray-700"
          >Als kleines (small) Bild speichern</label
        >
      </div>
    </div>

    <hr class="my-4 border-gray-300" />

    <div class="mt-4 space-y-4">
      <div
        v-for="image in images"
        :key="image.id"
        class="rounded-lg border border-l-8 border-l-blue-500 bg-gray-100 p-4"
      >
        <div class="flex justify-between">
          <h3 class="font-semibold">{{ image.filename }}</h3>
          <div class="flex items-center space-x-2">
            <button
              @click="handleImageDelete(image)"
              class="rounded bg-gray-200 p-1 px-2 hover:bg-red-500 hover:text-white active:bg-red-700"
              :disabled="deletingImage === image.id"
            >
              <span v-if="deletingImage === image.id" class="pi pi-spin pi-spinner"></span>
              <span v-else class="pi pi-trash"></span>
            </button>
          </div>
        </div>
        <p class="mt-2 text-sm text-gray-600">{{ image.url }}</p>
        <div class="mt-4 w-full overflow-hidden rounded">
          <img
            :src="`https://raw.githubusercontent.com/${githubOwner}/${githubRepo}/main/${image.url}`"
            :alt="image.filename"
            class="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  </div>
</template>
