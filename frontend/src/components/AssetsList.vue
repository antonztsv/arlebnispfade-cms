<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ListTitle from '@/components/ListTitle.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { fetchARMedia, addARMedia, ARMedia } from '@/api/arMedia';
import { fetchImages, addImage, Image } from '@/api/images';
import ARMediaList from '@/components/ARMediaList.vue';
import ImageList from '@/components/ImageList.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const routeId = route.params.routeId as string;
const arMedia = ref<ARMedia[]>([]);
const images = ref<Image[]>([]);
const loadingARMedia = ref(true);
const loadingImages = ref(true);
const errorARMedia = ref<string | null>(null);
const errorImages = ref<string | null>(null);

onMounted(async () => {
  await loadARMedia();
  await loadImages();
});

async function loadARMedia() {
  try {
    arMedia.value = await fetchARMedia(routeId);
  } catch (error) {
    console.error('Error fetching AR media:', error);
    errorARMedia.value = 'Fehler beim Laden der AR-Medien.';
  } finally {
    loadingARMedia.value = false;
  }
}

async function loadImages() {
  try {
    images.value = await fetchImages(routeId);
  } catch (error) {
    console.error('Error fetching images:', error);
    errorImages.value = 'Fehler beim Laden der Bilder.';
  } finally {
    loadingImages.value = false;
  }
}

const handleARMediaUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    try {
      const newARMedia = await addARMedia(routeId, input.files[0]);
      arMedia.value.push(newARMedia);
    } catch (error) {
      console.error('Error uploading AR media:', error);
      errorARMedia.value = 'Fehler beim Hochladen des AR-Mediums.';
    }
  }
};

const handleImageUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    try {
      const newImage = await addImage(routeId, input.files[0]);
      images.value.push(newImage);
    } catch (error) {
      console.error('Error uploading image:', error);
      errorImages.value = 'Fehler beim Hochladen des Bildes.';
    }
  }
};
</script>

<template>
  <section class="grid grid-cols-1 gap-4 space-y-4 md:grid-cols-2 md:space-y-0">
    <div>
      <ListTitle
        title="AR-Medien"
        to="/ar-media"
        :loading="loadingARMedia"
        :count="arMedia.length"
      />
      <LoadingSpinner v-if="loadingARMedia" />
      <div v-else-if="errorARMedia" class="text-red-500">{{ errorARMedia }}</div>
      <ARMediaList v-else :ar-media="arMedia" />
      <div class="mt-4">
        <input type="file" @change="handleARMediaUpload" class="hidden" id="ar-media-upload" />
        <label
          for="ar-media-upload"
          class="cursor-pointer rounded bg-gray-200 p-2 px-4 hover:bg-gray-300"
        >
          <span class="pi pi-plus mr-2 self-center text-sm"></span>
          Hinzufügen
        </label>
      </div>
    </div>
    <div>
      <ListTitle title="Bilder" to="/images" :loading="loadingImages" :count="images.length" />
      <LoadingSpinner v-if="loadingImages" />
      <div v-else-if="errorImages" class="text-red-500">{{ errorImages }}</div>
      <ImageList v-else :images="images" />
      <div class="mt-4">
        <input
          type="file"
          @change="handleImageUpload"
          class="hidden"
          id="image-upload"
          accept="image/*"
        />
        <label
          for="image-upload"
          class="cursor-pointer rounded bg-gray-200 p-2 px-4 hover:bg-gray-300"
        >
          <span class="pi pi-plus mr-2 self-center text-sm"></span>
          Hinzufügen
        </label>
      </div>
    </div>
  </section>
</template>
