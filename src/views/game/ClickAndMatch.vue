<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Game state
const gameData = ref(null)
const loading = ref(true)
const error = ref(null)
const selectedScenario = ref(null)
const selectedClass = ref(null)
const matches = ref([])
const gameCompleted = ref(false)
const score = ref(0)
const showFeedback = ref(false)
const feedbackMessage = ref('')
const isCorrectMatch = ref(false)

// Get API URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'


// Fetch game data
const fetchGameData = async () => {
  try {
    loading.value = true
    error.value = null

    const response = await fetch(`${API_BASE_URL}/api/simulation-games/click-match`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.success) {
      // Transform the API response to match what the component expects
        if (data.success && data.scenarios && data.classes && data.correctMatches) {
      // scenarios
      const scenarios = data.scenarios.map(item => ({
        id: item.id,
        text: item.text.replace(/"/g, '')
      }))

      // classes (shuffled)
      const classes = [...data.classes.map(item => ({
        id: item.id,
        text: item.text.replace(/"/g, '')
      }))].sort(() => Math.random() - 0.5)

      // correctMatches
      const correctMatches = data.correctMatches.map(item => ({
        id: item.id,
        scenario: item.scenario.replace(/"/g, ''),
        class: item.class.replace(/"/g, '')
      }))

      gameData.value = {
        success: true,
        count: data.count,
        scenarios,
        classes,
        correctMatches
      }

      } else {
        throw new Error('Invalid data format: missing questions array')
      }
    } else {
      throw new Error(data.error || 'Failed to load game data')
    }
  } catch (err) {
    console.error('Error fetching game data:', err)
    error.value = `Failed to load game: ${err.message}`
  } finally {
    loading.value = false
  }
}

// Handle card selection (scenario or class)
const selectCard = (item, type) => {
  if (isMatched(item.id)) return

  if (type === 'scenario') {
    // If clicking the same scenario, deselect it
    if (selectedScenario.value?.id === item.id) {
      selectedScenario.value = null
      return
    }

    selectedScenario.value = item

    // If a class is already selected, attempt match immediately
    if (selectedClass.value) {
      attemptMatch()
    }
  } else if (type === 'class') {
    // If clicking the same class, deselect it
    if (selectedClass.value?.id === item.id) {
      selectedClass.value = null
      return
    }

    selectedClass.value = item

    // If a scenario is already selected, attempt match immediately
    if (selectedScenario.value) {
      attemptMatch()
    }
  }
}

// Check if item is already matched
const isMatched = (id) => {
  return matches.value.some(match => match.id === id)
}

// Handle match attempt
const attemptMatch = () => {
  if (!selectedScenario.value || !selectedClass.value) return

  // Check if the selected scenario and class have the same ID (same database record)
  const isCorrect = selectedScenario.value.id === selectedClass.value.id

  if (isCorrect) {
    matches.value.push({
      id: selectedScenario.value.id,
      scenario: selectedScenario.value.text,
      class: selectedClass.value.text
    })
    score.value += 1
    feedbackMessage.value = 'Perfect match! ✅'
    isCorrectMatch.value = true

    showFeedback.value = true
    setTimeout(() => {
      showFeedback.value = false

      // Check if game is completed
      if (matches.value.length === gameData.value.count) {
        gameCompleted.value = true
      }
    }, 1500)
  } else {
    const encouragements = [
      "Almost there! Try again.",
      "Not quite, but you’re getting closer.",
      "Keep going, you’ll get it.",
      "Good attempt! Have another go."
    ]
    feedbackMessage.value = encouragements[Math.floor(Math.random() * encouragements.length)]
    isCorrectMatch.value = false
  }

  showFeedback.value = true
  setTimeout(() => {
    showFeedback.value = false
  }, 1500)

  selectedScenario.value = null
  selectedClass.value = null

  if (matches.value.length === gameData.value.count) {
    gameCompleted.value = true
  }
}

// Reset game
const resetGame = () => {
  selectedScenario.value = null
  selectedClass.value = null
  matches.value = []
  gameCompleted.value = false
  score.value = 0
  showFeedback.value = false
  fetchGameData()
}

// Go back to games menu
const goBack = () => {
  router.push('/simulation-games')
}

onMounted(() => {
  fetchGameData()
})
</script>

<template>
  <div class="relative w-full min-h-screen bg-gray-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">

    <!-- Back Button -->
    <div class="max-w-7xl mx-auto mb-6">
      <button
        @click="goBack"
        class="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        Back to Games
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center min-h-96">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading game...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex justify-center items-center min-h-96">
      <div class="text-center max-w-md">
        <p class="text-red-600 mb-4">{{ error }}</p>
        <div class="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-left text-sm">
          <p class="font-semibold text-yellow-800 mb-2">Troubleshooting:</p>
          <ul class="text-yellow-700 space-y-1">
            <li>• Make sure your backend server is running</li>
            <li>• Check if the API route exists</li>
            <li>• Verify your Express router is properly mounted</li>
            <li>• Check browser console for detailed error logs</li>
          </ul>
        </div>
        <button
          @click="fetchGameData"
          class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Game Content -->
    <div v-else-if="gameData" class="max-w-7xl mx-auto">

      <!-- Game Title -->
      <div class="text-center mb-8 sm:mb-12">
        <h1
          class="text-black font-bold mb-4"
          style="font-family: 'League Spartan'; font-size: clamp(24px, 4vw, 42px)"
        >
          Click and Match
        </h1>
      </div>

        <!-- Instructions -->
      <div v-if="!gameCompleted && gameData.scenarios && gameData.classes" class="text-center mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
        <p class="text-blue-800 font-medium">
          💡 <strong>How to play:</strong> Click on a scenario card and then click on the matching scam type card.
          If they match, both cards will turn green. If not, nothing happens - try again!
        </p>
        <p v-if="selectedScenario && !selectedClass" class="mt-2 text-blue-700">
          ✨ Scenario selected! Now choose a scam type to match it with.
        </p>
        <p v-else-if="selectedClass && !selectedScenario" class="mt-2 text-blue-700">
          ✨ Scam type selected! Now choose a scenario to match it with.
        </p>
      </div>

      <!-- Game Completed -->
      <div v-if="gameCompleted" class="text-center mb-8 p-8 bg-green-50 rounded-xl border-2 border-green-200">
        <div class="text-6xl mb-4">🎉</div>
        <h2 class="text-3xl font-bold text-green-800 mb-2">Congratulations!</h2>
        <p class="text-green-700 mb-6">
          You completed all matches! Score: {{ score }}/{{ gameData.count }}
        </p>
        <div class="flex justify-center gap-4">
          <button
            @click="resetGame"
            class="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Play Again
          </button>
          <button
            @click="goBack"
            class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Back to Home
          </button>
        </div>
      </div>

      <!-- Feedback Message-->
      <div
        v-if="showFeedback"
        class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 p-6 rounded-xl shadow-2xl"
        :class="isCorrectMatch
          ? 'bg-green-100 border-2 border-green-300'
          : 'bg-yellow-100 border-2 border-yellow-300'"
      >
        <p
          class="text-xl font-semibold text-center"
          :class="isCorrectMatch ? 'text-green-800' : 'text-yellow-800'"
        >
          {{ feedbackMessage }}
        </p>
      </div>

      <!-- Game Area -->
      <div v-if="!gameCompleted && gameData.scenarios && gameData.classes" class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 pt-8">
        <!-- Scenarios Column -->
        <div>
          <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
            📄 Scenarios
          </h2>
          <div class="space-y-4">
            <div
              v-for="(scenario, index) in gameData.scenarios"
              :key="`scenario-${scenario.id}`"
              @click="selectCard(scenario, 'scenario')"
              class="min-h-32 p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer flex items-start"
              :class="{
                'bg-blue-50 border-blue-300 shadow-md': selectedScenario?.id === scenario.id,
                'bg-green-50 border-green-300 shadow-md': isMatched(scenario.id),
                'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm': !selectedScenario || (selectedScenario.id !== scenario.id && !isMatched(scenario.id)),
                'opacity-50 cursor-not-allowed': isMatched(scenario.id)
              }"
            >
              <div class="w-full">
                <div class="flex items-start">
                  <div class="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm mr-4 flex-shrink-0">
                    {{ index + 1 }}
                  </div>
                  <p class="text-gray-800 leading-relaxed flex-1">{{ scenario.text }}</p>
                </div>
                <div v-if="isMatched(scenario.id)" class="mt-3 flex items-center text-green-600">
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-sm font-medium">Matched!</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Classes Column -->
        <div>
          <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
            🏷️ Scam Types
          </h2>
          <div class="space-y-4">
            <div
              v-for="(classItem, index) in gameData.classes"
              :key="`class-${classItem.id}`"
              @click="selectCard(classItem, 'class')"
              class="min-h-32 p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer flex items-center"
              :class="{
                'bg-purple-50 border-purple-300 shadow-md': selectedClass?.id === classItem.id,
                'bg-green-50 border-green-300 shadow-md': isMatched(classItem.id),
                'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm': !selectedClass || (selectedClass.id !== classItem.id && !isMatched(classItem.id)),
                'opacity-50 cursor-not-allowed': isMatched(classItem.id)
              }"
            >
              <div class="w-full">
                <div class="flex items-center justify-center">
                  <p class="text-gray-800 font-semibold text-center text-lg">{{ classItem.text }}</p>
                </div>
                <div v-if="isMatched(classItem.id)" class="mt-3 flex items-center justify-center text-green-600">
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-sm font-medium">Matched!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional custom styles here if needed */
</style>

