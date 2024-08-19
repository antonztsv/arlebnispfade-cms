<script setup lang="ts">
defineProps<{
  show: boolean;
  title: string;
  message: string;
}>();

defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="fixed inset-0 bg-black opacity-50"></div>
    <div class="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
      <h2 class="mb-4 text-xl font-bold">{{ title }}</h2>
      <p class="mb-6">{{ message }}</p>
      <div class="space-x-4">
        <button
          @click="$emit('confirm')"
          class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Bestätigen
        </button>
        <button
          @click="$emit('cancel')"
          class="rounded bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
        >
          Abbrechen
        </button>
      </div>
    </div>
  </div>
</template>
