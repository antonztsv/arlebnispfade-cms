<script setup lang="ts">
import RoutesList from '@/components/RoutesList.vue';
import PullRequestList from '@/components/PullRequestList.vue';
</script>

<template>
  <div>
    <RoutesList :filter="3" />
    <PullRequestList :filter="6" />
  </div>
</template>
