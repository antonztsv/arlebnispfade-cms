<script setup lang="ts">
import { ref } from 'vue';
import type { POI } from '@/api/pois';

const emit = defineEmits<{
  (e: 'create', poiData: Omit<POI, 'id'>): void;
}>();

const showForm = ref(false);
const newPOI = ref<Omit<POI, 'id'>>({
  title: '',
  image: '',
  layout: 'poi',
  gmaps: null,
  coords: [0, 0],
  info: '',
  arDesc: '',
  type: '',
  ar: {
    type: '',
    content: '',
    location: '',
    nft: [],
  },
});

function toggleForm() {
  showForm.value = !showForm.value;
}

function handleSubmit() {
  emit('create', newPOI.value);
  newPOI.value = {
    title: '',
    image: '',
    layout: 'poi',
    gmaps: null,
    coords: [0, 0],
    info: '',
    arDesc: '',
    type: '',
    ar: {
      type: '',
      content: '',
      location: '',
      nft: [],
    },
  };
  showForm.value = false;
}
</script>

<template>
  <div class="new-poi-card rounded-lg border border-gray-300 bg-gray-100 p-4 hover:bg-gray-200">
    <div
      v-if="!showForm"
      @click="toggleForm"
      class="flex h-full cursor-pointer items-center justify-center"
    >
      <span class="pi pi-plus text-2xl text-gray-400"></span>
    </div>
    <form v-else @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
        <input
          v-model="newPOI.title"
          id="title"
          type="text"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label for="image" class="block text-sm font-medium text-gray-700">Image</label>
        <input
          v-model="newPOI.image"
          id="image"
          type="text"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label for="type" class="block text-sm font-medium text-gray-700">Type</label>
        <input
          v-model="newPOI.type"
          id="type"
          type="text"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div class="flex justify-end space-x-2">
        <button
          type="button"
          @click="toggleForm"
          class="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Create
        </button>
      </div>
    </form>
  </div>
</template>
