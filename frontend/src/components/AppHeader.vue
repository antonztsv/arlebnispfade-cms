<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const isMenuOpen = ref(false);

const logout = () => {
  authStore.logout();
  router.push('/login');
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>

<template>
  <header class="bg-blue-600 py-4 text-white">
    <nav class="container mx-auto flex items-center justify-between px-4">
      <RouterLink to="/" class="font-headline text-xl font-bold hover:text-gray-100"
        >ARlebnispfade OBK</RouterLink
      >

      <!-- Desktop Menu -->
      <div class="hidden items-center space-x-4 md:flex">
        <RouterLink to="/routes" class="rounded px-4 py-2 hover:bg-blue-700 active:bg-blue-800"
          >Routen</RouterLink
        >
        <RouterLink to="/changes" class="rounded px-4 py-2 hover:bg-blue-700 active:bg-blue-800"
          >Änderungen</RouterLink
        >
        <button
          @click="logout"
          title="Abmelden"
          class="rounded bg-blue-600 px-4 py-2 hover:bg-red-500"
        >
          <span class="pi pi-sign-out"></span>
        </button>
      </div>

      <!-- Hamburger Menu Button -->
      <button @click="toggleMenu" class="text-white focus:outline-none md:hidden">
        <span class="pi pi-bars h-6 w-6"></span>
      </button>
    </nav>

    <!-- Mobile Menu -->
    <div v-if="isMenuOpen" class="container mx-auto pt-3 md:hidden">
      <div class="space-y-1 px-2 pb-3 pt-2">
        <RouterLink
          to="/routes"
          class="block rounded px-3 py-2 hover:bg-blue-700 active:bg-blue-800"
          >Routen</RouterLink
        >
        <RouterLink
          to="/changes"
          class="block rounded px-3 py-2 hover:bg-blue-700 active:bg-blue-800"
          >Änderungen</RouterLink
        >
        <button
          @click="logout"
          class="flex w-full justify-between rounded px-3 py-2 text-left hover:bg-red-800"
        >
          Abmelden
        </button>
      </div>
    </div>
  </header>
</template>
