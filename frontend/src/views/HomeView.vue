<script setup lang="ts"></script>

<template>
  <div class="mt-7">
    <h1 class="mb-5 font-headline text-3xl font-bold">Tailwind Test</h1>

    <!-- Basic 3-column layout -->
    <div class="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
      <div class="bg-blue-200 p-4">Column 1</div>
      <div class="bg-green-200 p-4">Column 2</div>
      <div class="bg-blue-200 p-4">Column 3</div>
    </div>

    <!-- Responsive layout with different column spans -->
    <div class="mb-8 grid grid-cols-4 gap-4">
      <div class="col-span-4 bg-yellow-300 p-4 md:col-span-2">Span 4 (2 on md+)</div>
      <div class="col-span-2 bg-blue-500 p-4 text-white md:col-span-1">Span 2 (1 on md+)</div>
      <div class="col-span-2 bg-red-500 p-4 text-white md:col-span-1">Span 2 (1 on md+)</div>
    </div>

    <!-- Complex layout example -->
    <div class="mb-8 grid grid-cols-6 gap-2">
      <div class="col-span-6 bg-gray-500 p-4 text-white md:col-span-4">Main Content</div>
      <div class="col-span-3 bg-blue-200 p-4 md:col-span-2">Sidebar 1</div>
      <div class="col-span-3 bg-green-200 p-4 md:col-span-2">Sidebar 2</div>
    </div>

    <!-- Nested grid example -->
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div>
        <div class="mb-4 bg-blue-500 p-4 text-white">Nested Parent 1</div>
        <div class="grid grid-cols-2 gap-2">
          <div class="bg-blue-200 p-4">Nested Child 1</div>
          <div class="bg-green-200 p-4">Nested Child 2</div>
        </div>
      </div>
      <div>
        <div class="mb-4 bg-red-500 p-4 text-white">Nested Parent 2</div>
        <div class="grid grid-cols-2 gap-2">
          <div class="bg-blue-200 p-4">Nested Child 3</div>
          <div class="bg-green-200 p-4">Nested Child 4</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
