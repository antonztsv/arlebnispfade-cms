<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue';

const props = defineProps<{
  images: { id: string; url: string }[];
}>();

const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};

const currentImageIndex = ref(0);

const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % props.images.length;
};

const prevImage = () => {
  currentImageIndex.value =
    (currentImageIndex.value - 1 + props.images.length) % props.images.length;
};
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-lg bg-white p-6">
      <h2 class="mb-8 text-2xl font-bold">NFT-Bilder</h2>
      <div class="flex h-[70vh] flex-col items-center justify-center">
        <img
          :src="images[currentImageIndex].url + '.jpg'"
          :alt="images[currentImageIndex].id"
          class="max-h-full max-w-full object-contain"
        />
        <p class="mt-2 text-sm text-gray-600">{{ images[currentImageIndex].id }}</p>
      </div>
      <div class="mt-4 flex justify-between">
        <button
          v-if="images.length > 1"
          @click="prevImage"
          class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          :disabled="images.length <= 1"
        >
          <span class="pi pi-arrow-left mr-2"></span>
          Vorheriges Bild
        </button>
        <button
          v-if="images.length > 1"
          @click="nextImage"
          class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          :disabled="images.length <= 1"
        >
          Nächstes Bild
          <span class="pi pi-arrow-right ml-2"></span>
        </button>
      </div>
      <button
        @click="closeModal"
        class="mt-4 w-full rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
      >
        Schließen
      </button>
    </div>
  </div>
</template>
