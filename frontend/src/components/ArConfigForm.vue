<script setup lang="ts">
import { computed } from 'vue';
import type { POI } from '@/api/pois';

const props = defineProps<{
  arConfig: POI['ar'];
  isEditing: boolean;
  isSaving: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:arConfig', value: POI['ar']): void;
}>();

const arTypes = ['image-tracking', 'location-based'];
const arContentTypes = ['video', 'audio', 'model', 'mixed'] as const;

type ArContentType = (typeof arContentTypes)[number];

const localArConfig = computed({
  get: () => props.arConfig,
  set: (value) => emit('update:arConfig', value),
});

const addMedia = (type: ArContentType) => {
  if (type === 'mixed') return;
  if (!localArConfig.value[type]) {
    localArConfig.value[type] = [];
  }
  if (type === 'audio') {
    (localArConfig.value[type] as any).push({ filename: '' });
  } else {
    (localArConfig.value[type] as any).push({ type: '', url: '' });
  }
};

const removeMedia = (type: ArContentType, index: number) => {
  if (type === 'mixed') return;
  (localArConfig.value[type] as any)?.splice(index, 1);
};

const addNft = () => {
  localArConfig.value.nft.push({
    type: '',
    id: '',
    name: '',
    position: '',
    rotation: '',
    scale: '',
  });
};

const removeNft = (index: number) => {
  localArConfig.value.nft.splice(index, 1);
};

const currentMediaType = computed((): ArContentType => {
  return localArConfig.value.content as ArContentType;
});

const addButtonLabel = computed(() => {
  switch (currentMediaType.value) {
    case 'video':
      return 'Video hinzufügen';
    case 'audio':
      return 'Audio hinzufügen';
    case 'model':
      return '3D-Modell hinzufügen';
    default:
      return 'Medium hinzufügen';
  }
});
</script>

<template>
  <fieldset class="mb-4 rounded border border-gray-300 p-4">
    <legend class="text-lg font-medium">AR Konfiguration</legend>

    <div class="mb-2">
      <label for="ar-type" class="mb-1 block text-sm font-medium text-gray-700">AR Typ</label>
      <select
        id="ar-type"
        v-model="localArConfig.type"
        :disabled="!isEditing || isSaving"
        class="w-full rounded border border-gray-300 p-2"
      >
        <option v-for="type in arTypes" :key="type" :value="type">{{ type }}</option>
      </select>
    </div>

    <div class="mb-2">
      <label for="ar-content" class="mb-1 block text-sm font-medium text-gray-700">AR Inhalt</label>
      <select
        id="ar-content"
        v-model="localArConfig.content"
        :disabled="!isEditing || isSaving"
        class="w-full rounded border border-gray-300 p-2"
      >
        <option v-for="type in arContentTypes" :key="type" :value="type">{{ type }}</option>
      </select>
    </div>

    <div class="mb-2">
      <label for="ar-location" class="mb-1 block text-sm font-medium text-gray-700"
        >AR Standort</label
      >
      <input
        id="ar-location"
        v-model="localArConfig.location"
        :disabled="!isEditing || isSaving"
        class="w-full rounded border border-gray-300 p-2"
      />
    </div>

    <!-- Audio -->
    <div v-if="localArConfig.audio" class="mb-2">
      <label class="mb-1 block text-sm font-medium text-gray-700">Audio</label>
      <div
        v-for="(audio, index) in localArConfig.audio"
        :key="index"
        class="mb-2 flex items-center space-x-2"
      >
        <input
          v-model="audio.filename"
          :disabled="!isEditing || isSaving"
          class="w-full rounded border border-gray-300 p-2"
          placeholder="Dateiname"
        />
        <button
          v-if="isEditing && !isSaving"
          @click="removeMedia('audio', index)"
          class="rounded bg-red-500 p-2 text-white"
          type="button"
        >
          Entfernen
        </button>
      </div>
    </div>

    <!-- Video -->
    <div v-if="localArConfig.video" class="mb-2">
      <label class="mb-1 block text-sm font-medium text-gray-700">Video</label>
      <div
        v-for="(video, index) in localArConfig.video"
        :key="index"
        class="mb-2 flex items-center space-x-2"
      >
        <input
          v-model="video.type"
          :disabled="!isEditing || isSaving"
          class="w-1/4 rounded border border-gray-300 p-2"
          placeholder="Typ"
        />
        <input
          v-model="video.url"
          :disabled="!isEditing || isSaving"
          class="w-3/4 rounded border border-gray-300 p-2"
          placeholder="URL oder Dateiname"
        />
        <button
          v-if="isEditing && !isSaving"
          @click="removeMedia('video', index)"
          class="rounded bg-red-500 p-2 text-white"
          type="button"
        >
          Entfernen
        </button>
      </div>
    </div>

    <!-- Model -->
    <div v-if="localArConfig.model" class="mb-2">
      <label class="mb-1 block text-sm font-medium text-gray-700">3D-Modell</label>
      <div
        v-for="(model, index) in localArConfig.model"
        :key="index"
        class="mb-2 flex items-center space-x-2"
      >
        <input
          v-model="model.type"
          :disabled="!isEditing || isSaving"
          class="w-1/4 rounded border border-gray-300 p-2"
          placeholder="Typ"
        />
        <input
          v-model="model.url"
          :disabled="!isEditing || isSaving"
          class="w-3/4 rounded border border-gray-300 p-2"
          placeholder="URL oder Dateiname"
        />
        <button
          v-if="isEditing && !isSaving"
          @click="removeMedia('model', index)"
          class="rounded bg-red-500 p-2 text-white"
          type="button"
        >
          Entfernen
        </button>
      </div>
    </div>

    <button
      v-if="isEditing && !isSaving && currentMediaType !== 'mixed'"
      @click="addMedia(currentMediaType)"
      class="mb-4 mt-2 rounded bg-green-500 p-2 text-white"
      type="button"
    >
      {{ addButtonLabel }}
    </button>

    <!-- NFT -->
    <div class="mb-2">
      <label class="mb-1 block text-sm font-medium text-gray-700">NFT</label>
      <div
        v-for="(nft, index) in localArConfig.nft"
        :key="index"
        class="mb-2 grid grid-cols-2 gap-2"
      >
        <div>
          <label class="text-xs text-gray-600">Typ</label>
          <input
            v-model="nft.type"
            :disabled="!isEditing || isSaving"
            class="w-full rounded border border-gray-300 p-2"
            placeholder="Typ"
          />
        </div>
        <div>
          <label class="text-xs text-gray-600">ID</label>
          <input
            v-model="nft.id"
            :disabled="!isEditing || isSaving"
            class="w-full rounded border border-gray-300 p-2"
            placeholder="ID"
          />
        </div>
        <div>
          <label class="text-xs text-gray-600">Name</label>
          <input
            v-model="nft.name"
            :disabled="!isEditing || isSaving"
            class="w-full rounded border border-gray-300 p-2"
            placeholder="Name"
          />
        </div>
        <div>
          <label class="text-xs text-gray-600">Position</label>
          <input
            v-model="nft.position"
            :disabled="!isEditing || isSaving"
            class="w-full rounded border border-gray-300 p-2"
            placeholder="Position"
          />
        </div>
        <div>
          <label class="text-xs text-gray-600">Rotation</label>
          <input
            v-model="nft.rotation"
            :disabled="!isEditing || isSaving"
            class="w-full rounded border border-gray-300 p-2"
            placeholder="Rotation"
          />
        </div>
        <div>
          <label class="text-xs text-gray-600">Scale</label>
          <input
            v-model="nft.scale"
            :disabled="!isEditing || isSaving"
            class="w-full rounded border border-gray-300 p-2"
            placeholder="Scale"
          />
        </div>
        <button
          v-if="isEditing && !isSaving"
          @click="removeNft(index)"
          class="col-span-2 rounded bg-red-500 p-2 text-white"
          type="button"
        >
          Entfernen
        </button>
      </div>
      <button
        v-if="isEditing && !isSaving"
        @click="addNft"
        class="mt-2 rounded bg-green-500 p-2 text-white"
        type="button"
      >
        NFT hinzufügen
      </button>
    </div>
  </fieldset>
</template>
