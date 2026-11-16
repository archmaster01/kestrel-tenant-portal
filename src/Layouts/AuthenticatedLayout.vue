<template>
  <div class="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
    <header class="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between shrink-0">
      <div class="flex items-center gap-3">
        <div class="w-7 h-7 rounded bg-emerald-600 flex items-center justify-center font-bold text-xs text-white">
          K
        </div>
        <span class="font-bold text-sm tracking-wide text-white">Kestrel AI — Tenant Portal</span>
      </div>
      <div class="text-xs text-gray-400 font-mono">
        operator@kestrel-portal.example.com
      </div>
    </header>

    <main class="flex-1 flex flex-col overflow-hidden">
      <slot />
    </main>
  </div>
</template>

<script setup>
</script>
