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
      <label for="poi-title" class="mb-1 block text-sm font-medium text-gray-700">Titel</label>
      <input
        id="poi-title"
        v-model="localEditedPoi.title"
        :disabled="!isEditing || isSaving"
        class="w-full rounded border border-gray-300 p-2"
        required
      />
    </div>

    <div class="mb-4">
      <label for="poi-image" class="mb-1 block text-sm font-medium text-gray-700">Bild</label>
      <input
        id="poi-image"
        v-model="localEditedPoi.image"
        :disabled="!isEditing || isSaving"
        class="w-full rounded border border-gray-300 p-2"
        required
      />
    </div>

    <div class="mb-4">
      <label for="poi-type" class="mb-1 block text-sm font-medium text-gray-700">Typ</label>
      <input
        id="poi-type"
        v-model="localEditedPoi.type"
        :disabled="!isEditing || isSaving"
        class="w-full rounded border border-gray-300 p-2"
      />
    </div>

    <div class="mb-4">
      <label for="poi-layout" class="mb-1 block text-sm font-medium text-gray-700">Layout</label>
      <select
        id="poi-layout"
        v-model="localEditedPoi.layout"
        :disabled="!isEditing || isSaving"
        class="w-full rounded border border-gray-300 p-2 disabled:bg-inherit"
        required
      >
        <option value="poi">poi</option>
      </select>
    </div>

    <div class="mb-4">
      <label for="poi-info" class="mb-1 block text-sm font-medium text-gray-700">Info</label>
      <textarea
        id="poi-info"
        v-model="localEditedPoi.info"
        :disabled="!isEditing || isSaving"
        rows="5"
        class="w-full rounded border border-gray-300 p-2"
      ></textarea>
    </div>

    <div class="mb-4">
      <label for="poi-arDesc" class="mb-1 block text-sm font-medium text-gray-700"
        >AR Beschreibung</label
      >
      <textarea
        id="poi-arDesc"
        v-model="localEditedPoi.arDesc"
        :disabled="!isEditing || isSaving"
        rows="5"
        class="w-full rounded border border-gray-300 p-2"
      ></textarea>
    </div>
  </div>
</template>
