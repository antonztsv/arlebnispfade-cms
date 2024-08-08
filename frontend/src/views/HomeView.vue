<script setup lang="ts"></script>

<template>
  <div class="mt-7">
    <h1 class="font-headline text-3xl font-bold mb-5">Grid Testing</h1>

    <!-- Basic 3-column layout -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div class="bg-blue-200 p-4">Column 1</div>
      <div class="bg-green-200 p-4">Column 2</div>
      <div class="bg-blue-200 p-4">Column 3</div>
    </div>

    <!-- Responsive layout with different column spans -->
    <div class="grid grid-cols-4 gap-4 mb-8">
      <div class="col-span-4 md:col-span-2 bg-yellow-300 p-4">Span 4 (2 on md+)</div>
      <div class="col-span-2 md:col-span-1 bg-blue-500 text-white p-4">Span 2 (1 on md+)</div>
      <div class="col-span-2 md:col-span-1 bg-red-500 text-white p-4">Span 2 (1 on md+)</div>
    </div>

    <!-- Complex layout example -->
    <div class="grid grid-cols-6 gap-2 mb-8">
      <div class="col-span-6 md:col-span-4 bg-gray-500 text-white p-4">Main Content</div>
      <div class="col-span-3 md:col-span-2 bg-blue-200 p-4">Sidebar 1</div>
      <div class="col-span-3 md:col-span-2 bg-green-200 p-4">Sidebar 2</div>
    </div>

    <!-- Nested grid example -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div>
        <div class="bg-blue-500 text-white p-4 mb-4">Nested Parent 1</div>
        <div class="grid grid-cols-2 gap-2">
          <div class="bg-blue-200 p-4">Nested Child 1</div>
          <div class="bg-green-200 p-4">Nested Child 2</div>
        </div>
      </div>
      <div>
        <div class="bg-red-500 text-white p-4 mb-4">Nested Parent 2</div>
        <div class="grid grid-cols-2 gap-2">
          <div class="bg-blue-200 p-4">Nested Child 3</div>
          <div class="bg-green-200 p-4">Nested Child 4</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
