<script setup lang="ts">
import { computed } from 'vue';
import { ArNft } from '@/api/pois';

const props = defineProps<{
  routeId: string;
  poiId: string;
  nfts: ArNft[];
}>();

const getNFTUrl = (nft: ArNft) => {
  return `https://raw.githubusercontent.com/${import.meta.env.VITE_GH_OWNER}/${
    import.meta.env.VITE_GH_REPO
  }/main/src/${props.routeId}/ar-media/images/${nft.id}`;
};

const getModelUrl = (nft: ArNft) => {
  return `https://raw.githubusercontent.com/${import.meta.env.VITE_GH_OWNER}/${
    import.meta.env.VITE_GH_REPO
  }/main/src/${props.routeId}/ar-media/models/${nft.model}`;
};
</script>

<style scoped>
.ar-viewer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
}
</style>

<template>
  <div class="ar-viewer">
    <a-scene embedded arjs="sourceType: webcam; debugUIEnabled: false;">
      <a-nft
        v-for="nft in nfts"
        :key="nft.id"
        :type="nft.type"
        :url="getNFTUrl(nft)"
        :smooth="true"
        :smoothCount="10"
        :smoothTolerance="0.01"
        :smoothThreshold="5"
      >
        <a-entity
          :gltf-model="getModelUrl(nft)"
          :scale="nft.scale"
          :position="nft.position"
          :rotation="nft.rotation"
        ></a-entity>
      </a-nft>
      <a-entity camera></a-entity>
    </a-scene>
  </div>
</template>
