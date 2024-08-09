<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/MainHeader.vue'
import Footer from './components/MainFooter.vue'
</script>

<template>
  <Header />

  <RouterView />

  <Footer />
</template>

<style scoped></style>
