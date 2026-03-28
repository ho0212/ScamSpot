<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Game state
const currentQuestion = ref(0)
const userAnswers = ref([])
const showFeedback = ref(false)
const gameCompleted = ref(false)
const questions = ref([])
const isLoading = ref(true)
const error = ref(null)

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Computed properties
const currentQuestionData = computed(() => questions.value[currentQuestion.value])
const progress = computed(() => {
  if (questions.value.length === 0) return 0
  return ((currentQuestion.value + 1) / questions.value.length) * 100
})
const score = computed(() => {
  return userAnswers.value.filter((answer, index) =>
    answer.userAnswer === questions.value[index].answer
  ).length
})

const scorePercentage = computed(() => {
  if (questions.value.length === 0) return 0
  return Math.round((score.value / questions.value.length) * 100)
})

// Methods
async function fetchQuestions() {
  try {
    isLoading.value = true
    error.value = null

    const response = await fetch(`${API_BASE_URL}/api/simulation-games/true-false`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.success && data.questions) {
      questions.value = data.questions
    } else {
      throw new Error('Invalid response format')
    }
  } catch (err) {
    console.error('Error fetching questions:', err)
    error.value = 'Failed to load questions. Please try again.'
  } finally {
    isLoading.value = false
  }
}

function submitAnswer(answer) {
  const questionData = currentQuestionData.value
  const isCorrect = answer === questionData.answer

  userAnswers.value[currentQuestion.value] = {
    userAnswer: answer,
    correctAnswer: questionData.answer,
    isCorrect: isCorrect,
    explanation: questionData.explanation
  }

  showFeedback.value = true
}

function nextQuestion() {
  if (currentQuestion.value < questions.value.length - 1) {
    currentQuestion.value++
    showFeedback.value = false
  } else {
    gameCompleted.value = true
  }
}

async function restartGame() {
  currentQuestion.value = 0
  userAnswers.value = []
  showFeedback.value = false
  gameCompleted.value = false

  // Fetch new questions for a fresh game
  await fetchQuestions()
}

function returnToGames() {
  router.push('/simulation-games')
}

function getProgressColor(questionIndex) {
  if (questionIndex <= currentQuestion.value && userAnswers.value[questionIndex]) {
    return userAnswers.value[questionIndex].isCorrect ? 'bg-green-500' : 'bg-yellow-300'
  } else if (questionIndex === currentQuestion.value) {
    return 'bg-blue-500'
  } else {
    return 'bg-gray-300'
  }
}

// Lifecycle
onMounted(async () => {
  await fetchQuestions()
})
</script>

<template>
  <div class="relative w-full min-h-screen bg-gray-50 py-4 sm:py-8 px-4 sm:px-6 lg:px-8">

    <!-- Loading State -->
    <div v-if="isLoading" class="max-w-4xl mx-auto mt-20">
      <div class="bg-white rounded-lg shadow-lg p-6 sm:p-8 lg:p-10 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <h2 class="text-xl sm:text-2xl font-bold text-gray-800" style="font-family: 'League Spartan'">
          Loading Questions...
        </h2>
        <p class="text-gray-600 mt-2" style="font-family: 'League Spartan'">
          Please wait while we prepare your quiz
        </p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-4xl mx-auto mt-20">
      <div class="bg-white rounded-lg shadow-lg p-6 sm:p-8 lg:p-10 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <h2 class="text-xl sm:text-2xl font-bold text-red-800 mb-4" style="font-family: 'League Spartan'">
          Oops! Something went wrong
        </h2>
        <p class="text-gray-600 mb-6" style="font-family: 'League Spartan'">
          {{ error }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            @click="fetchQuestions"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            style="font-family: 'League Spartan'"
          >
            TRY AGAIN
          </button>
          <button
            @click="returnToGames"
            class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            style="font-family: 'League Spartan'"
          >
            BACK TO GAMES
          </button>
        </div>
      </div>
    </div>

    <!-- Game Content (only show when questions are loaded) -->
    <template v-else-if="questions.length > 0">
      <!-- Return to Games Button (Top Left) - Only show during game -->
      <!-- <div class="absolute top-4 left-4 sm:top-6 sm:left-6 z-10" v-if="!gameCompleted">
        <button
          @click="returnToGames"
          class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-lg text-sm sm:text-base transition-colors duration-200 transform hover:scale-105"
          style="font-family: 'League Spartan'"
        >
          ← BACK TO GAMES
        </button>
      </div> -->
      <div class="max-w-7xl mx-auto mb-6" v-if="!gameCompleted">
        <button
          @click="returnToGames"
          class="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        Back to Games
      </button>
      </div>

            <div class="text-center mb-8 sm:mb-12">
          <h1
            class="text-black font-bold mb-4"
            style="font-family: 'League Spartan'; font-size: clamp(24px, 4vw, 42px)"
          >
            True or False
          </h1>
        </div>

      <!-- Progress Bar -->
      <div class="max-w-4xl mx-auto mb-6 sm:mb-8 mt-4 sm:mt-4" v-if="!gameCompleted">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm sm:text-base font-medium text-gray-700" style="font-family: 'League Spartan'">
            Question {{ currentQuestion + 1 }} of {{ questions.length }}
          </span>
          <span class="text-sm sm:text-base font-medium text-gray-700" style="font-family: 'League Spartan'">
            {{ Math.round(progress) }}%
          </span>
        </div>

        <!-- Progress indicators -->
        <div class="flex gap-1 sm:gap-2 mb-4">
          <div
            v-for="(question, index) in questions"
            :key="index"
            class="flex-1 h-2 sm:h-3 rounded-full transition-colors duration-300"
            :class="getProgressColor(index)"
          ></div>
        </div>
      </div>

      <!-- Game Content -->
      <div class="max-w-4xl mx-auto">

        <!-- Question and Feedback Phase -->
        <div class="bg-white rounded-lg shadow-lg p-6 sm:p-8 lg:p-10" v-if="!gameCompleted">
          <h2
            class="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 text-gray-800 leading-tight"
            style="font-family: 'League Spartan'"
          >
            {{ currentQuestionData.statement }}
          </h2>

          <!-- Show buttons if no feedback yet -->
          <div v-if="!showFeedback" class="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center items-center">
            <button
              @click="submitAnswer(true)"
              class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 sm:px-12 rounded-lg text-lg sm:text-xl transition-colors duration-200 transform hover:scale-105"
              style="font-family: 'League Spartan'"
            >
              TRUE
            </button>

            <button
              @click="submitAnswer(false)"
              class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 sm:px-12 rounded-lg text-lg sm:text-xl transition-colors duration-200 transform hover:scale-105"
              style="font-family: 'League Spartan'"
            >
              FALSE
            </button>
          </div>

          <!-- Show feedback under the question -->
          <div v-if="showFeedback">
            <div class="text-center mb-6">
              <div
                v-if="userAnswers[currentQuestion].isCorrect"
                class="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full mb-4"
              >
                <svg class="w-8 h-8 sm:w-10 sm:h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div
                v-else
                class="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-yellow-100 rounded-full mb-4"
              >
                <svg class="w-8 h-8 sm:w-10 sm:h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>

              <h3
                class="text-xl sm:text-2xl font-bold mb-2"
                :class="userAnswers[currentQuestion].isCorrect ? 'text-green-600' : 'text-yellow-600'"
                style="font-family: 'League Spartan'"
              >
                {{ userAnswers[currentQuestion].isCorrect ? 'Excellent!' : 'Good try! Let\'s learn together.' }}
              </h3>

              <p class="text-sm sm:text-base text-gray-600 mb-2" style="font-family: 'League Spartan'">
                Answer: {{ userAnswers[currentQuestion].correctAnswer ? 'TRUE' : 'FALSE' }}
              </p>
            </div>

            <div class="bg-blue-50 rounded-lg p-4 sm:p-6 mb-6">
              <h4 class="font-bold text-base sm:text-lg mb-2 text-blue-900" style="font-family: 'League Spartan'">
                Explanation:
              </h4>
              <p class="text-sm sm:text-base text-blue-800 leading-relaxed" style="font-family: 'League Spartan'">
                {{ userAnswers[currentQuestion].explanation }}
              </p>
            </div>

            <div class="text-center">
              <button
                @click="nextQuestion"
                class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 sm:px-8 rounded-lg text-base sm:text-lg transition-colors duration-200 transform hover:scale-105"
                style="font-family: 'League Spartan'"
              >
                {{ currentQuestion < questions.length - 1 ? 'NEXT QUESTION' : 'SEE RESULTS' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Results Phase -->
        <div v-if="gameCompleted" class="bg-white rounded-lg shadow-lg p-6 sm:p-8 lg:p-10 text-center">
          <div class="mb-6 sm:mb-8">
            <div
              class="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full mb-4 sm:mb-6"
              :class="scorePercentage >= 70 ? 'bg-green-100' : 'bg-yellow-100'"
            >
              <span
                class="text-2xl sm:text-3xl font-bold"
                :class="scorePercentage >= 70 ? 'text-green-600' : 'text-yellow-600'"
                style="font-family: 'League Spartan'"
              >
                {{ scorePercentage }}%
              </span>
            </div>

            <h2
              class="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-gray-800"
              style="font-family: 'League Spartan'"
            >
              Quiz Complete!
            </h2>

            <p
              class="text-lg sm:text-xl text-gray-600 mb-2"
              style="font-family: 'League Spartan'"
            >
              You scored {{ score }} out of {{ questions.length }}
            </p>

            <p
              class="text-sm sm:text-base text-gray-500"
              style="font-family: 'League Spartan'"
            >
              {{ scorePercentage >= 70 ? 'Great job! You\'re well-prepared to spot scams.' : 'Keep learning! Practice makes perfect.' }}
            </p>
          </div>

          <!-- Score Breakdown -->
          <div class="bg-gray-50 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
            <h3 class="font-bold text-base sm:text-lg mb-4 text-gray-800" style="font-family: 'League Spartan'">
              Your Answers:
            </h3>

            <div class="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2 sm:gap-3">
              <div
                v-for="(answer, index) in userAnswers"
                :key="index"
                class="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-white font-bold text-sm"
                :class="answer.isCorrect ? 'bg-green-500' : 'bg-gray-400'"
                style="font-family: 'League Spartan'"
              >
                {{ index + 1 }}
              </div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              @click="restartGame"
              class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 sm:px-8 rounded-lg text-base sm:text-lg transition-colors duration-200 transform hover:scale-105"
              style="font-family: 'League Spartan'"
            >
              PLAY AGAIN
            </button>

            <button
              @click="returnToGames"
              class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 sm:px-8 rounded-lg text-base sm:text-lg transition-colors duration-200 transform hover:scale-105"
              style="font-family: 'League Spartan'"
            >
              RETURN TO GAMES
            </button>
          </div>
        </div>

      </div>
    </template>
  </div>
</template>

<style>
body {
  margin: 0;
}
</style>
