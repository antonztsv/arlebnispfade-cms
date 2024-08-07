<script setup lang="ts"></script>

<template>
  <div class="container mt-2xl">
    <h1 class="mb-lg">Grid Testing</h1>

    <!-- Basic 3-column layout -->
    <div class="grid grid-cols-1 grid-cols-3-md gap-md mb-xl">
      <div class="bg-obk-akzent-1 p-md">Column 1</div>
      <div class="bg-obk-akzent-2 p-md">Column 2</div>
      <div class="bg-obk-akzent-1 p-md">Column 3</div>
    </div>

    <!-- Responsive layout with different column spans -->
    <div class="grid grid-cols-4 gap-md mb-xl">
      <div class="col-span-4 col-span-2-md bg-obk-gelb p-md">Span 4 (2 on md+)</div>
      <div class="col-span-2 col-span-1-md bg-obk-blau text-lightest p-md">Span 2 (1 on md+)</div>
      <div class="col-span-2 col-span-1-md bg-obk-rot text-lightest p-md">Span 2 (1 on md+)</div>
    </div>

    <!-- Complex layout example -->
    <div class="grid grid-cols-6 gap-sm mb-xl">
      <div class="col-span-6 col-span-4-md bg-obk-grau text-lightest p-md">Main Content</div>
      <div class="col-span-3 col-span-2-md bg-obk-akzent-1 p-md">Sidebar 1</div>
      <div class="col-span-3 col-span-2-md bg-obk-akzent-2 p-md">Sidebar 2</div>
    </div>

    <!-- Nested grid example -->
    <div class="grid grid-cols-2 gap-md">
      <div class="col-span-2 col-span-1-lg">
        <div class="bg-obk-blau text-lightest p-md mb-md">Nested Parent 1</div>
        <div class="grid grid-cols-2 gap-sm">
          <div class="bg-obk-akzent-1 p-md">Nested Child 1</div>
          <div class="bg-obk-akzent-2 p-md">Nested Child 2</div>
        </div>
      </div>
      <div class="col-span-2 col-span-1-lg">
        <div class="bg-obk-rot text-lightest p-md mb-md">Nested Parent 2</div>
        <div class="grid grid-cols-2 gap-sm">
          <div class="bg-obk-akzent-1 p-md">Nested Child 3</div>
          <div class="bg-obk-akzent-2 p-md">Nested Child 4</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
