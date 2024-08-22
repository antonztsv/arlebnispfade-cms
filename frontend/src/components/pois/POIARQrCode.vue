<script setup lang="ts">
import { computed } from 'vue';
import QRCode from 'qrcode.vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const authStore = useAuthStore();
const currentToken = authStore.token;

const qrCodeValue = computed(() => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  return `${baseUrl}/api/ar-preview/${route.params.routeId}/${route.params.poiId}?token=${currentToken}`;
});
</script>

<template>
  <div class="ar-preview rounded-lg border bg-white p-4 shadow-md">
    <h3 class="mb-2 text-lg font-semibold">AR-Vorschau</h3>
    <div class="flex items-start justify-between">
      <div class="flex-shrink-0">
        <QRCode :value="qrCodeValue" :size="200" level="M" />
      </div>
      <div class="ml-4 flex-grow">
        <p class="text-sm text-gray-600">
          Scannen Sie diesen QR-Code mit Ihrem Smartphone, um die AR-Vorschau zu sehen.
        </p>
      </div>
    </div>
  </div>
</template>
