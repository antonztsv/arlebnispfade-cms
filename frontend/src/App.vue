<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const logout = () => {
  authStore.logout();
};
</script>

<template>
  <div v-if="authStore.isAuthenticated" class="flex flex-col">
    <header class="bg-slate-700 py-4 text-white">
      <nav class="container mx-auto flex items-center justify-between px-4">
        <RouterLink to="/" class="font-headline text-xl font-bold">ARlebnispfade OBK</RouterLink>
        <div>
          <button
            @click="logout"
            title="Abmelden"
            class="rounded bg-slate-700 px-4 py-2 hover:bg-slate-800"
          >
            <span class="pi pi-sign-out"></span>
          </button>
        </div>
      </nav>
    </header>
    <main class="container mx-auto flex-grow px-5 pt-12">
      <RouterView />
    </main>
  </div>
  <RouterView v-else />
</template>
