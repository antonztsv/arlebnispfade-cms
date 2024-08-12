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
</template>
