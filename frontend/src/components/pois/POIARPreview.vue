<script setup lang="ts">
import { computed } from 'vue';
import QRCode from 'qrcode.vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const authStore = useAuthStore();
const currentToken = authStore.token;

const qrCodeValue = computed(() => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/ar-preview/${route.params.routeId}/${route.params.poiId}?token=${currentToken}`;
});
</script>

<template>
  <div class="ar-preview">
    <h3 class="mb-2 text-lg font-semibold">AR-Vorschau</h3>
    <p class="mb-2 text-sm text-gray-600">
      Scannen Sie diesen QR-Code mit Ihrem Smartphone, um die AR-Vorschau zu sehen.
    </p>
    <QRCode :value="qrCodeValue" :size="200" level="M" />
  </div>
</template>
