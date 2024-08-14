<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const username = ref('');
const password = ref('');
const error = ref('');

const handleSubmit = async () => {
  error.value = '';
  if (!username.value || !password.value) {
    error.value = 'Benutzername und Passwort sind erforderlich.';
    return;
  }

  try {
    await authStore.login(username.value, password.value);
    router.push('/');
  } catch (err) {
    error.value = 'Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Anmeldedaten.';
  }
};
</script>

<template>
  <div class="flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">
      <div>
        <h2 class="mt-6 text-center font-headline text-3xl font-bold">Anmelden</h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="-space-y-px rounded-md shadow-sm">
          <div>
            <label for="username" class="sr-only">Benutzername</label>
            <input
              id="username"
              v-model="username"
              name="username"
              type="text"
              required
              class="block w-full rounded-none rounded-t border border-gray-300 px-3 py-2 text-sm placeholder-gray-500"
              placeholder="Benutzername"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Passwort</label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              required
              class="block w-full rounded-none rounded-b border border-gray-300 px-3 py-2 text-sm placeholder-gray-500"
              placeholder="Passwort"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="w-full rounded border border-transparent bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 active:bg-blue-800"
          >
            Anmelden
          </button>
        </div>
      </form>
      <p v-if="error" class="mt-2 text-center text-sm text-red-600">
        {{ error }}
      </p>
    </div>
  </div>
</template>
