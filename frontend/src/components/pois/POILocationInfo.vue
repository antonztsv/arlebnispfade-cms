<script setup lang="ts">
import { computed } from 'vue';
import { POI } from '@/api/pois';

const props = defineProps<{
  editedPoi: POI;
  isEditing: boolean;
  isSaving: boolean;
}>();

const emit = defineEmits(['update:editedPoi']);

const localEditedPoi = computed({
  get: () => props.editedPoi,
  set: (value) => emit('update:editedPoi', value),
});
</script>

<template>
  <div>
    <div class="mb-4">
      <label for="poi-gmaps" class="mb-1 block text-sm font-medium text-gray-700"
        >Google Maps URL</label
      >
      <input
        id="poi-gmaps"
        v-model="localEditedPoi.gmaps"
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
          v-model="localEditedPoi.coords[0]"
          :disabled="!isEditing || isSaving"
          class="w-1/2 rounded border border-gray-300 p-2"
          type="number"
          step="any"
          placeholder="Breitengrad"
        />
        <input
          id="poi-coords-lon"
          v-model="localEditedPoi.coords[1]"
          :disabled="!isEditing || isSaving"
          class="w-1/2 rounded border border-gray-300 p-2"
          type="number"
          step="any"
          placeholder="Längengrad"
        />
      </div>
    </div>
  </div>
</template>
