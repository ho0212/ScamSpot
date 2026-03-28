<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const password = ref('')
const errorMessage = ref('')
const correctPassword = import.meta.env.VITE_APP_PASSWORD

const DEFAULT_HOME_URL = '/home';

onMounted(() => {
  // Hide header on password page
  const header = document.querySelector('header')
  if (header) {
    header.style.display = 'none'
  }
})

function handleSubmit() {
  if (password.value === correctPassword) {

    sessionStorage.setItem('scamspot_auth', 'true')

    // Show header again
    const header = document.querySelector('header')
    if (header) {
      header.style.display = 'block'
    }

    let targetUrl = DEFAULT_HOME_URL;
    // Check if URL contains "?redirect"
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    if (redirect) {
      targetUrl = redirect;
    }
    router.push(targetUrl)
  } else {
    errorMessage.value = 'Incorrect password. Please try again.'
    password.value = ''

    // Clear error message after 3 seconds
    setTimeout(() => {
      errorMessage.value = ''
    }, 3000)
  }
}

function handleKeyPress(event) {
  if (event.key === 'Enter') {
    handleSubmit()
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-blue-900 flex items-center justify-center px-4">
    <div class="w-full max-w-md space-y-8 text-center">

      <div>
        <h1
          class="text-white text-4xl md:text-5xl font-bold mb-2"
          style="font-family: 'League Spartan'"
        >
          ScamSpot
        </h1>
        <p class="text-blue-200 text-lg">
          Enter password to continue
        </p>
      </div>

      <!-- Password Form -->
      <div class="space-y-6">
        <div>
          <input
            v-model="password"
            type="password"
            placeholder="Enter password..."
            @keypress="handleKeyPress"
            class="w-full px-4 py-3 text-lg bg-white border-0 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 placeholder-gray-400"
            style="font-family: 'League Spartan'"
          />
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="text-red-300 text-sm font-medium">
          {{ errorMessage }}
        </div>

        <!-- Submit Button -->
        <button
          @click="handleSubmit"
          class="w-full bg-white text-blue-900 py-3 px-6 rounded-lg text-lg font-bold hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-400"
          style="font-family: 'League Spartan'"
        >
          ENTER
        </button>
      </div>

    </div>
  </div>
</template>
