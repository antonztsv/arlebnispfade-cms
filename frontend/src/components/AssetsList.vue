<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ListTitle from '@/components/ListTitle.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { fetchARMedia, ARMedia } from '@/api/arMedia';
import { fetchImages, Image } from '@/api/images';
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
</script>

<template>
  <section class="grid grid-cols-1 gap-4 space-y-4 md:grid-cols-2 md:space-y-0">
    <div>
      <ListTitle title="AR-Medien" :loading="loadingARMedia" :count="arMedia.length" />
      <LoadingSpinner v-if="loadingARMedia" />
      <div v-else>
        <ARMediaList :ar-media="arMedia" />
      </div>
    </div>
    <div>
      <ListTitle title="Bilder" :loading="loadingImages" :count="images.length" />
      <LoadingSpinner v-if="loadingImages" />
      <ImageList v-else :images="images" />
    </div>
  </section>
</template>
