<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="container">
      <h1>ARlebnispfade OBK CMS</h1>
    </div>
  </header>

  <div class="container">
    <RouterView />
  </div>
</template>

<style scoped>
header {
  background-color: var(--darker);
  padding: 10px 0;

  h1 {
    color: var(--lightest);
  }
}
</style>
