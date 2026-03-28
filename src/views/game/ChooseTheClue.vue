<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import lotteryBanner from '@/assets/picture/lottery_banner.png'
import microsoftBanner from '@/assets/picture/microsoft_banner.png'
import fundBanner from '@/assets/picture/fund_banner.png'


const imageMap = {
  'lottery_banner.png': lotteryBanner,
  'microsoft_banner.png': microsoftBanner,
  'fund_banner.png': fundBanner
}

const router = useRouter()

const questions = ref([])
const currentIndex = ref(0)
const selectedArea = ref(null)
const processedContent = ref({})
const showResults = ref(false)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const currentQuestion = computed(() => questions.value[currentIndex.value] || null)
const progress = computed(() => ((currentIndex.value + 1) / questions.value.length) * 100)
const goBack = () => {
  router.push('/simulation-games')
}
const explanationRef = ref(null)

// Load game data
const loadGameData = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/simulation-games/choose-clue`)
    const data = await res.json()
    if (data.success) {
      questions.value = data.data
      if (questions.value.length > 0) buildAllContent()
    }
  } catch (err) {
    console.error('Error loading game data:', err)
  }
}

const injectImages = (html) => {
  return html.replace(/src=['"]([^'"]+)['"]/g, (match, filename) => {
    const imageSrc = imageMap[filename]
    if (imageSrc) {
      // Add CSS classes to control size
      return `src="${imageSrc}" class="max-w-2xl h-auto max-h-96 object-contain"`
    }
    return match
  })
}
const buildAllContent = () => {
  if (!currentQuestion.value) return

  // Define fields depending on type
  const fields = currentQuestion.value.type === 'email'
    ? ['sender', 'address', 'subject', 'content']
    : ['phone_number', 'content']

  processedContent.value = {}
  const usedIndices = new Set() // track highlighted areas that are already inserted

  fields.forEach((field) => {
    let text = currentQuestion.value[field] || ''

    currentQuestion.value.highlighted_areas.forEach((area, index) => {
      if (usedIndices.has(index)) return // skip if already used

      const cleanText = area.content.replace(/^"+|"+$/g, '')

      // Decide if this field should contain the highlight
      // Always allow content field for SMS/email body
      const fieldMatches = field === 'content' || text.includes(cleanText)
      if (!fieldMatches) return

      const clickable = `<span
        class="highlighted-area bg-yellow-200 hover:bg-yellow-300 cursor-pointer px-1 py-0.5 rounded transition-colors"
        data-area-index="${index}"
        title="Click to select this area"
      >${cleanText}</span>`

      // escape regex special chars
      const regex = new RegExp(cleanText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))

      // replace only the first occurrence in this field
      if (regex.test(text)) {
        text = text.replace(regex, clickable)
        usedIndices.add(index) // mark as used
      }
    })

    // processedContent.value[field] = text
    processedContent.value[field] = injectImages(text)
  })
}

// Handle click on highlighted area
const handleClick = (event) => {
  const target = event.target
  if (!target.classList.contains('highlighted-area')) return

  const index = Number(target.dataset.areaIndex)
  const area = currentQuestion.value.highlighted_areas[index]

  selectedArea.value = area

  // Reset colors for all
  document.querySelectorAll('.highlighted-area').forEach((el) => {
    el.classList.remove('bg-red-200', 'bg-green-200')
    el.classList.add('bg-yellow-200', 'hover:bg-yellow-300')
  })

  // Color selected
  target.classList.remove('bg-yellow-200', 'hover:bg-yellow-300')
  target.classList.add(area.is_red_flag ? 'bg-green-200' : 'bg-red-200')
}

// Next question
const nextQuestion = () => {
  if (!selectedArea.value?.is_red_flag) {
    alert('Please select the correct area before continuing!')
    return
  }

  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
    selectedArea.value = null
    buildAllContent()
  } else {
    showResults.value = true
  }
}

//Restart game
const restartGame = () => {
  currentIndex.value = 0
  selectedArea.value = null
  showResults.value = false
  loadGameData()
}

watch(selectedArea, async (newVal) => {
  if (newVal) {
    // wait for DOM update
    await nextTick()
    explanationRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
})


onMounted(() => {
  loadGameData()
  document.addEventListener('click', handleClick)
})
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
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
        <div class="text-center mb-8 sm:mb-12">
        <h1
          class="text-black font-bold mb-4"
          style="font-family: 'League Spartan'; font-size: clamp(24px, 4vw, 42px)"
        >
          Choose the Clue
        </h1>
      </div>

    <!-- Loading -->
    <div v-if="!currentQuestion && !showResults" class="text-center text-gray-500">
      Loading questions...
    </div>

    <!-- Game Content -->
    <div v-else-if="!showResults">
      <!-- Progress Bar -->
      <div class="mb-4">
        <div class="w-full bg-gray-200 h-2 rounded-full">
          <div class="bg-blue-500 h-2 rounded-full transition-all" :style="{ width: progress + '%' }"></div>
        </div>
        <div class="flex justify-between text-sm text-gray-600 mt-1">
          <span>Question {{ currentIndex + 1 }} of {{ questions.length }}</span>
        </div>
      </div>

      <!-- Question Header -->
      <p class="mb-4 text-gray-700">
        The given {{ currentQuestion.type === 'email' ? 'email' : 'SMS' }} is a scam. Click to spot the suspicious part and unlock “Next” by selecting it correctly.
      </p>

      <!-- Email/SMS Fields -->
      <div class="mb-4 border p-4 rounded bg-white">
        <template v-if="currentQuestion.type === 'email'">
          <p><strong>From:</strong> <span v-html="processedContent.sender"></span> &lt;<span v-html="processedContent.address"></span>&gt;</p>
          <p><strong>Subject:</strong> <span v-html="processedContent.subject"></span></p>
        </template>
        <template v-else>
          <p><strong>From:</strong> <span v-html="processedContent.phone_number"></span></p>
        </template>
      </div>

      <!-- Email/SMS Content -->
      <div class="mb-6 bg-gray-50 p-4 rounded border leading-relaxed whitespace-pre-wrap" v-html="processedContent.content"></div>

      <!-- Explanation -->
      <div
        v-if="selectedArea"
        ref="explanationRef"
        class="mb-6 p-4 rounded-lg bg-gray-100 border-l-4"
        :class="selectedArea.is_red_flag ? 'border-green-500' : 'border-red-500'"
      >
        <h3 class="font-medium mb-2" :class="selectedArea.is_red_flag ? 'text-green-700' : 'text-red-700'">
          {{ selectedArea.is_red_flag ? '✓ Correct!' : '✗ Incorrect' }}
        </h3>
        <p class="text-gray-700">{{ selectedArea.explanation }}</p>
      </div>

      <!-- Next Button -->
      <div class="text-center mt-6">
        <button
          @click="nextQuestion"
          class="px-6 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
          :disabled="!selectedArea || !selectedArea.is_red_flag"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Final Results -->
    <div v-else class="bg-white rounded-lg shadow-lg p-6 text-center">
      <!-- <h2 class="text-2xl font-bold text-gray-800 mb-4">Game Complete!</h2>
      <div class="text-4xl font-bold mb-4 text-blue-600">{{ questions.length }} questions completed</div> -->

            <h2
              class="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-gray-800"
              style="font-family: 'League Spartan'"
            >
              Game Complete!
            </h2>
                        <p
              class="text-lg sm:text-xl text-gray-600 mb-4"
              style="font-family: 'League Spartan'"
            >
               Great job! {{ questions.length }} questions completed. You’re well-prepared to spot scams.
            </p>

      <div class="space-x-4">
        <button @click="restartGame" class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors">
          Play Again
        </button>
        <button @click="$router.push('/simulation-games')" class="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors">
          Back to Games
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.highlighted-area {
  display: inline;
  user-select: none;
}
.highlighted-area:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

</style>
