<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/home')
}

function goBack() {
  router.back()
}
</script>

<template>
  <div class="min-h-screen bg-white flex items-center justify-center px-4 pt-20">
    <div class="text-center max-w-md">
      <!-- 404 Number -->
      <h1
        class="text-8xl md:text-9xl font-bold text-blue-900 mb-4"
        style="font-family: 'League Spartan'"
      >
        404
      </h1>

      <!-- Error Message -->
      <h2
        class="text-2xl md:text-3xl font-bold text-gray-800 mb-4"
        style="font-family: 'League Spartan'"
      >
        Page Not Found
      </h2>

      <p class="text-gray-600 mb-8 text-lg">
        Oops! The page you're looking for doesn't exist.
      </p>

      <!-- Action Buttons -->
      <div class="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
        <button
          @click="goHome"
          class="w-full sm:w-auto bg-blue-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-800 transition-colors duration-200"
        >
          GO HOME
        </button>

        <button
          @click="goBack"
          class="w-full sm:w-auto bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors duration-200"
        >
          GO BACK
        </button>
      </div>
    </div>
  </div>
</template>

