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

const updateAudioFilename = (event: Event) => {
  const filename = (event.target as HTMLInputElement).value;
  updateArProperty('audio', { filename });
};

const updateArProperty = (key: string, value: any) => {
  emit('update:editedPoi', {
    ...props.editedPoi,
    ar: { ...props.editedPoi.ar, [key]: value },
  });
};

const addAudio = () => {
  updateArProperty('audio', { filename: '' });
};

const removeAudio = () => {
  updateArProperty('audio', undefined);
};

const addVideo = () => {
  const newVideos = [...(localEditedPoi.value.ar.video || []), { type: 'filename', filename: '' }];
  updateArProperty('video', newVideos);
};

const removeVideo = (index: number) => {
  const newVideos = localEditedPoi.value.ar.video?.filter((_, i) => i !== index) || [];
  updateArProperty('video', newVideos);
};

const addModel = () => {
  const newModels = [...(localEditedPoi.value.ar.model || []), { type: '', url: '' }];
  updateArProperty('model', newModels);
};

const removeModel = (index: number) => {
  const newModels = localEditedPoi.value.ar.model?.filter((_, i) => i !== index) || [];
  updateArProperty('model', newModels);
};
</script>

<template>
  <div class="ar-config-form mb-4">
    <h3 class="mb-4 text-xl font-semibold">AR Konfiguration</h3>

    <div class="mb-4">
      <label for="ar-type" class="mb-1 block text-sm font-medium text-gray-700">AR Typ</label>
      <select
        id="ar-type"
        v-model="localEditedPoi.ar.type"
        :disabled="!isEditing || isSaving"
        class="w-full rounded border border-gray-300 p-2 disabled:bg-inherit"
      >
        <option value="image-tracking">Image Tracking</option>
        <option value="location-based">Location Based</option>
      </select>
    </div>

    <div class="mb-4">
      <label for="ar-content" class="mb-1 block text-sm font-medium text-gray-700">AR Inhalt</label>
      <select
        id="ar-content"
        v-model="localEditedPoi.ar.content"
        :disabled="!isEditing || isSaving"
        class="w-full rounded border border-gray-300 p-2 disabled:bg-inherit"
      >
        <option value="audio">Audio</option>
        <option value="video">Video</option>
        <option value="model">3D Model</option>
        <option value="mixed">Mixed</option>
      </select>
    </div>

    <div class="mb-4">
      <label for="ar-location" class="mb-1 block text-sm font-medium text-gray-700"
        >AR Standort</label
      >
      <input
        id="ar-location"
        v-model="localEditedPoi.ar.location"
        :disabled="!isEditing || isSaving"
        type="text"
        class="w-full rounded border border-gray-300 p-2"
      />
    </div>

    <!-- Audio Configuration -->
    <div class="mb-4">
      <label class="mb-1 block text-sm font-medium text-gray-700">Audio</label>
      <div v-if="localEditedPoi.ar.audio" class="mt-2 flex items-center">
        <input
          v-model="localEditedPoi.ar.audio.filename"
          :disabled="!isEditing || isSaving"
          type="text"
          placeholder="Audiodateiname"
          class="mr-2 w-full rounded border border-gray-300 p-2"
          @input="updateAudioFilename"
        />
        <button
          @click="removeAudio"
          :disabled="!isEditing || isSaving"
          class="rounded bg-red-500 p-2 px-4 text-white hover:bg-red-600 disabled:bg-gray-400"
          :class="{ hidden: !isEditing }"
          type="button"
        >
          Entfernen
        </button>
      </div>
      <button
        v-else
        @click="addAudio"
        :disabled="!isEditing || isSaving"
        class="mt-2 rounded bg-blue-500 p-2 px-4 text-white hover:bg-blue-600 disabled:bg-gray-400"
        :class="{ hidden: !isEditing }"
        type="button"
      >
        Audio hinzufügen
      </button>
    </div>

    <!-- Video Configuration -->
    <div class="mb-4">
      <label class="mb-1 block text-sm font-medium text-gray-700">Video</label>
      <template v-if="editedPoi.ar.video">
        <div
          v-for="(video, index) in editedPoi.ar.video"
          :key="index"
          class="mt-2 flex items-center"
        >
          <select
            v-model="video.type"
            :disabled="!isEditing || isSaving"
            class="mr-2 rounded border border-gray-300 p-2 disabled:bg-inherit"
          >
            <option value="filename">Dateiname</option>
            <option value="url">URL</option>
          </select>
          <input
            v-if="video.type === 'filename'"
            v-model="video.filename"
            :disabled="!isEditing || isSaving"
            type="text"
            placeholder="Videodateiname"
            class="mr-2 w-full rounded border border-gray-300 p-2"
          />
          <input
            v-else
            v-model="video.url"
            :disabled="!isEditing || isSaving"
            type="text"
            placeholder="Video-URL"
            class="mr-2 w-full rounded border border-gray-300 p-2"
          />
          <button
            @click="removeVideo(index)"
            :disabled="!isEditing || isSaving"
            class="rounded bg-red-500 p-2 px-4 text-white hover:bg-red-600 disabled:bg-gray-400"
            :class="{ hidden: !isEditing }"
            type="button"
          >
            Entfernen
          </button>
        </div>
      </template>
      <button
        @click="addVideo"
        :disabled="!isEditing || isSaving"
        class="mt-2 rounded bg-blue-500 p-2 px-4 text-white hover:bg-blue-600 disabled:bg-gray-400"
        :class="{ hidden: !isEditing }"
        type="button"
      >
        Video hinzufügen
      </button>
    </div>

    <!-- 3D Model Configuration -->
    <div class="mb-4">
      <label class="mb-1 block text-sm font-medium text-gray-700">3D Model</label>
      <template v-if="editedPoi.ar.model">
        <div
          v-for="(model, index) in editedPoi.ar.model"
          :key="index"
          class="mt-2 flex items-center"
        >
          <input
            v-model="model.type"
            :disabled="!isEditing || isSaving"
            type="text"
            placeholder="Modelltyp"
            class="mr-2 w-full rounded border border-gray-300 p-2"
          />
          <input
            v-model="model.url"
            :disabled="!isEditing || isSaving"
            type="text"
            placeholder="Modell-URL"
            class="mr-2 w-full rounded border border-gray-300 p-2"
          />
          <button
            @click="removeModel(index)"
            :disabled="!isEditing || isSaving"
            class="rounded bg-red-500 p-2 px-4 text-white hover:bg-red-600 disabled:bg-gray-400"
            :class="{ hidden: !isEditing }"
            type="button"
          >
            Entfernen
          </button>
        </div>
      </template>
      <button
        @click="addModel"
        :disabled="!isEditing || isSaving"
        class="mt-2 rounded bg-blue-500 p-2 px-4 text-white hover:bg-blue-600 disabled:bg-gray-400"
        :class="{ hidden: !isEditing }"
        type="button"
      >
        3D Model hinzufügen
      </button>
    </div>
  </div>
</template>
