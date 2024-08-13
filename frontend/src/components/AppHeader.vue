<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<template>
  <header class="bg-slate-700 py-4 text-white">
    <nav class="container mx-auto flex items-center justify-between px-4">
      <RouterLink to="/" class="font-headline text-xl font-bold">ARlebnispfade OBK</RouterLink>
      <div class="flex items-center space-x-4">
        <RouterLink to="/routes" class="rounded px-4 py-2 hover:bg-slate-800">Routen</RouterLink>
        <RouterLink to="/changes" class="rounded px-4 py-2 hover:bg-slate-800"
          >Änderungen</RouterLink
        >
        <button
          @click="logout"
          title="Abmelden"
          class="rounded bg-slate-600 px-4 py-2 hover:bg-red-800"
        >
          <span class="pi pi-sign-out"></span>
        </button>
      </div>
    </nav>
  </header>
</template>
