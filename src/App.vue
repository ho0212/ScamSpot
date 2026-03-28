<script setup>
import { ref, watch, nextTick } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'

const menuOpen = ref(false)
const menuHeight = ref('0px') // for smooth slide
const simulationDropdownOpen = ref(false)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
  // Close simulation dropdown when mobile menu toggles
  if (!menuOpen.value) {
    simulationDropdownOpen.value = false
  }
}

function toggleSimulationDropdown() {
  simulationDropdownOpen.value = !simulationDropdownOpen.value
}

function closeSimulationDropdown() {
  simulationDropdownOpen.value = false
}

// Update menu height whenever menuOpen or simulationDropdownOpen changes
const updateMenuHeight = async () => {
  await nextTick()
  const el = document.getElementById('mobile-menu')
  if (el && menuOpen.value) {
    menuHeight.value = el.scrollHeight + 'px'
  } else {
    menuHeight.value = '0px'
  }
}

// Watch menuOpen to animate height
watch(menuOpen, updateMenuHeight)

// Watch simulationDropdownOpen to update height when it changes
watch(simulationDropdownOpen, updateMenuHeight)

// Detect current route
const route = useRoute()
</script>

<template>
  <!-- Header -->
  <header class="bg-blue-900 text-white shadow-md fixed top-0 left-0 w-full z-50">
    <div class="max-w-[1280px] mx-auto flex justify-between items-center p-4">
      <div class="flex items-center space-x-3">
        <RouterLink to="/home" class="flex items-center space-x-3">
          <img src="@/assets/picture/logo.png" alt="Logo" class="w-10 h-10 object-contain" />
          <h1 class="text-2xl font-bold" style="font-family: 'League Spartan'">ScamSpot</h1>
        </RouterLink>
      </div>

      <!-- Desktop nav -->
      <nav class="hidden md:flex space-x-6 items-center">
        <RouterLink to="/home" class="hover:text-gray-300 transition duration-300">Home</RouterLink>
        <RouterLink to="/learning-module" class="hover:text-gray-300 transition duration-300"
          >Learning Module</RouterLink
        >
        <RouterLink to="/scam-detector" class="hover:text-gray-300 transition duration-300"
          >Scam Detector</RouterLink
        >

        <!-- Simulation Dropdown for Desktop -->
        <div class="relative">
          <button
            @click="toggleSimulationDropdown"
            class="flex items-center hover:text-gray-300 transition duration-300"
          >
            <span>Simulation</span>
            <svg
              :class="['ml-1 h-4 w-4 transition-transform duration-200', simulationDropdownOpen ? 'rotate-180' : '']"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Desktop Dropdown Menu -->
          <div
            v-show="simulationDropdownOpen"
            class="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-[60]"
          >
            <div class="py-2">
              <RouterLink
                to="/simulation-games"
                @click="closeSimulationDropdown"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150"
              >
                Games
              </RouterLink>
              <RouterLink
                to="/simulation-scenarios"
                @click="closeSimulationDropdown"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-150"
              >
                Scenario Stories
              </RouterLink>
            </div>
          </div>

          <!-- Backdrop to close dropdown -->
          <div
            v-show="simulationDropdownOpen"
            @click="closeSimulationDropdown"
            class="fixed inset-0 z-[59]"
          ></div>
        </div>

        <RouterLink to="/action-guide" class="hover:text-gray-300 transition duration-300"
          >Action Guide</RouterLink
>
        <RouterLink to="/scam-statistics" class="hover:text-gray-300 transition duration-300"
          >Scam Statistics</RouterLink
        >
      </nav>

      <!-- Mobile menu button -->
      <button class="md:hidden focus:outline-none z-[60]" @click="toggleMenu">
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path v-if="!menuOpen" d="M4 6h16M4 12h16M4 18h16" />
          <path v-else d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </header>

  <!-- Mobile nav menu -->
  <nav
    v-if="menuOpen"
    id="mobile-menu"
    class="md:hidden bg-blue-800 fixed top-[72px] left-0 w-full shadow-lg z-[999] transition-all duration-300 overflow-hidden"
    :style="{ maxHeight: menuHeight }"
  >
    <div class="flex flex-col p-4 space-y-2">
      <RouterLink
        to="/home"
        class="hover:text-gray-300 transition duration-300 text-white py-2"
        @click="menuOpen = false"
        >Home</RouterLink
      >
      <RouterLink
        to="/learning-module"
        class="hover:text-gray-300 transition duration-300 text-white py-2"
        @click="menuOpen = false"
        >Learning Module</RouterLink
      >
      <RouterLink
        to="/scam-detector"
        class="hover:text-gray-300 transition duration-300 text-white py-2"
        @click="menuOpen = false"
        >Scam Detector</RouterLink
      >

      <!-- Mobile Simulation Section -->
      <div class="text-white">
        <button
          @click="toggleSimulationDropdown"
          class="flex items-center justify-between w-full py-2 hover:text-gray-300 transition duration-300"
        >
          <span>Simulation</span>
          <svg
            :class="['h-4 w-4 transition-transform duration-200', simulationDropdownOpen ? 'rotate-180' : '']"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Mobile Simulation Submenu -->
        <div
          v-show="simulationDropdownOpen"
          class="ml-4 mt-2 space-y-2 transition-all duration-300"
        >
          <RouterLink
            to="/simulation-games"
            class="block text-sm text-gray-200 hover:text-white transition duration-300 py-1"
            @click="menuOpen = false; simulationDropdownOpen = false"
          >
            Games
          </RouterLink>

          <RouterLink
            to="/simulation-scenarios"
            class="block text-sm text-gray-200 hover:text-white transition duration-300 py-1"
            @click="menuOpen = false; simulationDropdownOpen = false"
          >
            Scenario Stories
          </RouterLink>
        </div>
      </div>

      <RouterLink
        to="/action-guide"
        class="hover:text-gray-300 transition duration-300 text-white py-2"
        @click="menuOpen = false"
        >Action Guide</RouterLink
      >
      <RouterLink
        to="/scam-statistics"
        class="hover:text-gray-300 transition duration-300 text-white py-2"
        @click="menuOpen = false"
        >Scam Statistics</RouterLink
      >
    </div>
  </nav>

  <!-- Backdrop overlay when menu is open -->
  <div
    v-if="menuOpen"
    class="md:hidden fixed inset-0 bg-black bg-opacity-50 z-[998]"
    @click="menuOpen = false"
  ></div>

  <main class="mx-auto pt-[72px]">
    <RouterView />
  </main>
</template>

<style>
body {
  font-family: 'Inter', sans-serif;
  margin: 0;
}
</style>
