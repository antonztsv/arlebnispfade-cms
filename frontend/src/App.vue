<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="bg-gray-800 py-5">
    <div class="container mx-auto px-5">
      <h1 class="font-headline text-3xl font-bold text-white">ARlebnispfade OBK CMS</h1>
    </div>
  </header>

  <div class="container mx-auto px-5">
    <RouterView />
  </div>
</template>

<style scoped></style>
