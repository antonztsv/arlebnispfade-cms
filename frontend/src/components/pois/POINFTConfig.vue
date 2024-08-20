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

const updateNFT = (index: number, key: string, value: any) => {
  const newNFTs = [...localEditedPoi.value.ar.nft];
  newNFTs[index] = { ...newNFTs[index], [key]: value };
  emit('update:editedPoi', {
    ...localEditedPoi.value,
    ar: { ...localEditedPoi.value.ar, nft: newNFTs },
  });
};

const addNFT = () => {
  const newNFTs = [
    ...localEditedPoi.value.ar.nft,
    {
      type: '',
      id: '',
      name: '',
      model: '',
      position: '',
      rotation: '',
      scale: '',
    },
  ];
  emit('update:editedPoi', {
    ...localEditedPoi.value,
    ar: { ...localEditedPoi.value.ar, nft: newNFTs },
  });
};

const removeNFT = (index: number) => {
  const newNFTs = localEditedPoi.value.ar.nft.filter((_, i) => i !== index);
  emit('update:editedPoi', {
    ...localEditedPoi.value,
    ar: { ...localEditedPoi.value.ar, nft: newNFTs },
  });
};
</script>

<template>
  <div class="mb-4">
    <label class="mb-1 block text-sm font-medium text-gray-700">NFT</label>
    <div v-for="(nft, index) in localEditedPoi.ar.nft" :key="index" class="mt-2 rounded border p-2">
      <div class="mb-2 flex items-center">
        <input
          v-model="nft.type"
          @input="updateNFT(index, 'type', ($event.target as HTMLInputElement).value)"
          :disabled="!isEditing || isSaving"
          type="text"
          placeholder="NFT-Typ"
          class="mr-2 w-full rounded border border-gray-300 p-2"
        />
        <input
          v-model="nft.id"
          @input="updateNFT(index, 'id', ($event.target as HTMLInputElement).value)"
          :disabled="!isEditing || isSaving"
          type="text"
          placeholder="NFT-ID"
          class="mr-2 w-full rounded border border-gray-300 p-2"
        />
        <input
          v-model="nft.name"
          @input="updateNFT(index, 'name', ($event.target as HTMLInputElement).value)"
          :disabled="!isEditing || isSaving"
          type="text"
          placeholder="NFT-Name"
          class="mr-2 w-full rounded border border-gray-300 p-2"
        />
      </div>
      <div class="mb-2 flex items-center">
        <input
          v-model="nft.model"
          @input="updateNFT(index, 'model', ($event.target as HTMLInputElement).value)"
          :disabled="!isEditing || isSaving"
          type="text"
          placeholder="NFT-Modell"
          class="mr-2 w-full rounded border border-gray-300 p-2"
        />
        <input
          v-model="nft.position"
          @input="updateNFT(index, 'position', ($event.target as HTMLInputElement).value)"
          :disabled="!isEditing || isSaving"
          type="text"
          placeholder="Position"
          class="mr-2 w-full rounded border border-gray-300 p-2"
        />
      </div>
      <div class="flex items-center">
        <input
          v-model="nft.rotation"
          @input="updateNFT(index, 'rotation', ($event.target as HTMLInputElement).value)"
          :disabled="!isEditing || isSaving"
          type="text"
          placeholder="Rotation"
          class="mr-2 w-full rounded border border-gray-300 p-2"
        />
        <input
          v-model="nft.scale"
          @input="updateNFT(index, 'scale', ($event.target as HTMLInputElement).value)"
          :disabled="!isEditing || isSaving"
          type="text"
          placeholder="Skalierung"
          class="mr-2 w-full rounded border border-gray-300 p-2"
        />
        <button
          @click="removeNFT(index)"
          :disabled="!isEditing || isSaving"
          class="rounded bg-red-500 p-2 px-4 text-white hover:bg-red-600 disabled:bg-gray-400"
          :class="{ hidden: !isEditing }"
          type="button"
        >
          Entfernen
        </button>
      </div>
    </div>
    <button
      @click="addNFT"
      :disabled="!isEditing || isSaving"
      class="mt-2 rounded bg-blue-500 p-2 px-4 text-white hover:bg-blue-600 disabled:bg-gray-400"
      :class="{ hidden: !isEditing }"
      type="button"
    >
      NFT hinzufügen
    </button>
  </div>
</template>
