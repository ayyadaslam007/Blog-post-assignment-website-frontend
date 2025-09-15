<template>
  <div id="app">
    <nav class="bg-blue-600 shadow-lg">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center py-4">
          <router-link
            to="/"
            class="text-white text-xl font-bold hover:text-blue-200 transition-colors"
          >
            📝 Mini Blog
          </router-link>
          <div class="space-x-4">
            <router-link
              to="/"
              class="text-white hover:text-blue-200 transition-colors px-3 py-2 rounded"
              :class="{ 'bg-blue-500': $route.name === 'Home' }"
            >
              Home
            </router-link>
            <router-link
              to="/admin"
              class="text-white hover:text-blue-200 transition-colors px-3 py-2 rounded"
              :class="{ 'bg-blue-500': $route.name === 'Admin' }"
            >
              Admin
            </router-link>
          </div>
        </div>
      </div>
    </nav>
    <main class="container mx-auto px-4 py-8">
      <router-view />
    </main>
    <Toast />
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
// No additional setup needed for this component
</script>

<style>
#app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-attachment: fixed;
}
main {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  margin: 20px auto;
  max-width: 1200px;
}
.router-link-active {
  background-color: rgba(255, 255, 255, 0.2) !important;
}
</style>