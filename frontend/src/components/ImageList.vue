<script setup lang="ts">
import { PropType, ref } from 'vue';
import { deleteImage, addImage, Image } from '@/api/images';
import { useToast } from 'vue-toastification';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { useRoute } from 'vue-router';

const toast = useToast();

const route = useRoute();
const routeId = route.params.routeId as string;
const loading = ref(false);

const githubOwner = import.meta.env.VITE_GH_OWNER as string;
const githubRepo = import.meta.env.VITE_GH_REPO as string;

defineProps({
  images: {
    type: Array as PropType<Image[]>,
    required: true,
  },
});

const handleImageUpload = async (event: Event) => {
  loading.value = true;
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    try {
      const newImage = await addImage(routeId, input.files[0]);
      toast.success('Änderung erfolgreich gespeichert');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Änderung konnte nicht gespeichert werden');
    } finally {
      loading.value = false;
    }
  }
};

const handleImageDelete = async (image: Image) => {
  loading.value = true;
  try {
    await deleteImage(routeId, image.id);
    toast.success('Änderung erfolgreich gespeichert');
  } catch (error) {
    console.error('Error deleting image:', error);
    toast.error('Änderung konnte nicht gespeichert werden');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <LoadingSpinner v-if="loading" />
  <div v-else>
    <input type="file" @click="handleImageUpload" class="hidden" id="ar-media-upload" />
    <label
      for="ar-media-upload"
      class="block cursor-pointer rounded bg-blue-500 p-2 px-4 text-center text-white hover:bg-blue-600 active:bg-blue-700"
      ><span class="pi pi-upload mr-2 text-sm"></span> Hinzufügen</label
    >
    <div class="mt-4 space-y-4">
      <div v-for="image in images" :key="image.id" class="route-card overflow-hidden rounded-lg">
        <div class="relative h-64 overflow-hidden">
          <div
            class="absolute inset-0 bg-cover bg-center transition-transform duration-300 ease-in-out"
            :style="{
              backgroundImage: `url('https://raw.githubusercontent.com/${githubOwner}/${githubRepo}/main/${image.url}')`,
            }"
          ></div>
          <div
            class="absolute inset-0 bg-black opacity-30 transition-opacity duration-300 ease-in-out"
          ></div>

          <h3
            class="absolute bottom-4 left-4 text-lg font-semibold text-white transition-transform duration-300 ease-in-out"
          >
            {{ image.filename }}
          </h3>
          <button class="absolute bottom-4 right-4"><span></span></button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.route-card:hover .bg-cover {
  transform: scale(1.1);
}

.route-card:hover .bg-black {
  opacity: 0.5;
}

.route-card:hover h3 {
  transform: translateY(-10px);
}
</style>
