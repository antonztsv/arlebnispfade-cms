<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import Header from '@/components/AppHeader.vue';

const authStore = useAuthStore();
</script>

<template>
  <div v-if="authStore.isAuthenticated" class="flex flex-col">
    <Header />
    <main class="container mx-auto flex-grow px-5 pt-12">
      <RouterView />
    </main>
  </div>
  <RouterView v-else />
</template>
