<script setup lang="ts">
defineProps<{
  isEditing: boolean;
  isNewPoi: boolean;
  isSaving: boolean;
  isDeleting: boolean;
}>();

defineEmits(['toggle-edit', 'delete-poi']);
</script>

<template>
  <div class="mt-6 space-x-2">
    <template v-if="!isEditing">
      <button
        v-if="!isEditing && !isNewPoi"
        @click="$emit('toggle-edit')"
        type="button"
        :disabled="isSaving || isDeleting"
        class="rounded bg-blue-500 p-2 px-4 text-white hover:bg-blue-600 active:bg-blue-700 disabled:bg-gray-400"
      >
        <span class="pi pi-file-edit mr-1"></span> Bearbeiten
      </button>
    </template>
    <template v-else>
      <button
        v-if="isEditing || isNewPoi"
        type="submit"
        :disabled="isSaving || isDeleting"
        class="rounded bg-blue-500 p-2 px-4 text-white hover:bg-blue-600 active:bg-blue-700 disabled:bg-gray-400"
      >
        <span v-if="isSaving" class="pi pi-spin pi-spinner mr-1"></span>
        <span v-else class="pi pi-save mr-1"></span>
        {{ isSaving ? 'Speichert...' : 'Speichern' }}
      </button>
      <button
        v-if="isEditing && !isNewPoi"
        @click="$emit('toggle-edit')"
        type="button"
        :disabled="isSaving || isDeleting"
        class="rounded bg-gray-200 p-2 px-4 hover:bg-gray-300 active:bg-gray-400 disabled:bg-gray-100"
      >
        Abbrechen
      </button>
      <button
        v-if="!isNewPoi"
        @click="$emit('delete-poi')"
        type="button"
        :disabled="isSaving || isDeleting"
        class="rounded bg-red-500 p-2 px-4 text-white hover:bg-red-600 active:bg-red-700 disabled:bg-gray-400"
      >
        <span v-if="isDeleting" class="pi pi-spin pi-spinner mr-1"></span>
        <span v-else class="pi pi-trash mr-1"></span>
        {{ isDeleting ? 'Löscht...' : 'Löschen' }}
      </button>
    </template>
  </div>
</template>
