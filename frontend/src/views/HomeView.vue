<script setup lang="ts">
import RoutesList from '@/components/routes/RoutesList.vue';
import PullRequestList from '@/components/pullRequests/PullRequestList.vue';
</script>

<template>
  <div>
    <RoutesList :filter="3" />
    <PullRequestList :filter="6" />
  </div>
</template>
