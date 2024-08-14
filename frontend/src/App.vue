<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import Header from '@/components/AppHeader.vue';

const authStore = useAuthStore();
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <Header v-if="authStore.isAuthenticated" />
    <main class="container mx-auto px-4 py-12">
      <RouterView />
    </main>
  </div>
</template>
