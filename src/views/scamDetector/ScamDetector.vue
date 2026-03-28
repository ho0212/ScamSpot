<template>
  <div class="relative w-full h-screen overflow-auto">
    <img
      src="@/assets/picture/scam_detector_bg.png"
      alt="Hero"
      class="absolute inset-0 w-full h-full object-cover opacity-25"
    />

    <!-- Mobile view -->
    <div
      class="flex md:hidden relative mt-10 z-10 flex-col justify-center h-full items-center px-4"
    >
      <main
        class="flex-1 flex flex-col w-full max-w-lg"
        :class="{ 'opacity-30': showQRTutorialPage }"
      >
        <h1 class="text-3xl font-bold text-black mb-4 text-center">SCAM DETECTION MODEL</h1>

        <TextAnalyzer
          v-model:inputText="inputText"
          :isAnalyzing="isAnalyzing"
          :maxInputLength="MAX_INPUT_LENGTH"
          :isMobile="true"
          @analyze="analyzeText"
          @clearResults="clearResults"
        />

        <ResultsDisplay :result="result" />
        <ErrorDisplay :errorMessage="errorMessage" />

        <InfoSection
          :isMobile="true"
          @navigate-to-guide="goToActionGuide"
          @qr-click="onQRCodeClick"
        />
      </main>
    </div>

    <!-- Desktop/Tablet view -->
    <div class="hidden md:flex relative mt-10 z-10 flex-col justify-center h-full items-center">
      <main
        class="flex-1 flex flex-col w-full max-w-2xl lg:w-3/6"
        :class="{ 'opacity-30': showQRTutorialPage }"
      >
        <h1
          class="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4 text-center"
          style="font-family: 'League Spartan'; font-size: clamp(28px, 5vw, 48px)"
        >
          SCAM DETECTION MODEL
        </h1>

        <TextAnalyzer
          v-model:inputText="inputText"
          :isAnalyzing="isAnalyzing"
          :maxInputLength="MAX_INPUT_LENGTH"
          :isMobile="false"
          @analyze="analyzeText"
          @clearResults="clearResults"
        />

        <ResultsDisplay :result="result" />
        <ErrorDisplay :errorMessage="errorMessage" />

        <InfoSection
          :isMobile="false"
          @navigate-to-guide="goToActionGuide"
          @qr-click="onQRCodeClick"
        />
      </main>
    </div>

    <QRTutorial
      v-model:currentPage="showQRTutorialPage"
      :totalPages="qrTutorialTotalPages"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import TextAnalyzer from '@/views/scamDetector/TextAnalyzer.vue'
import ResultsDisplay from '@/views/scamDetector/ResultsDisplay.vue'
import ErrorDisplay from '@/views/scamDetector/ErrorDisplay.vue'
import InfoSection from '@/views/scamDetector/InfoSection.vue'
import QRTutorial from '@/views/scamDetector/QRTutorial.vue'

const router = useRouter()

// Security configuration
const MAX_INPUT_LENGTH = 3000
const SUMMARY_CHAR_CAP = 350

const inputText = ref('')
const isAnalyzing = ref(false)
const result = ref(null)
const errorMessage = ref('')

// Track whether QR code tutorial is active
const qrTutorialTotalPages = 7
const showQRTutorialPage = ref(0)

// FastAPI URL Beanstalk
const API_BASE_URL = import.meta.env.VITE_API_DETECTOR_URL

// XSS Prevention - Input sanitization (moved to TextAnalyzer component)
const sanitizeInput = (text) => {
  if (typeof text !== 'string') return ''
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/data:/gi, '')
    .replace(/\r?\n/g, '\n')
    .slice(0, MAX_INPUT_LENGTH)
}

const clearResults = () => {
  result.value = null
  errorMessage.value = ''
}

const truncate = (str, n) => {
  if (!str) return ''
  return str.length > n ? str.slice(0, n - 1).trimEnd() + '…' : str
}

const analyzeText = async (textToAnalyze) => {
  if (!textToAnalyze.trim() || isAnalyzing.value) return

  isAnalyzing.value = true
  errorMessage.value = ''
  result.value = null

  try {
    const sanitizedText = sanitizeInput(textToAnalyze)

    if (!sanitizedText) {
      throw new Error('Invalid input')
    }

    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({ text: sanitizedText }),
    })

    if (!response.ok) {
      const msg = await response.text().catch(() => '')
      throw new Error(`HTTP ${response.status} ${msg}`)
    }

    const data = await response.json()

    if (!data || typeof data.label !== 'string' || typeof data.confidence !== 'number') {
      throw new Error('Invalid response format')
    }

    // Calculate risk level using 1 - confidence
    let riskScore
    if (data.label.toLowerCase() === 'scam') {
      riskScore = Math.max(0, Math.min(1, data.confidence))
    } else {
      riskScore = 1 - Math.max(0, Math.min(1, data.confidence))
    }

    let riskLevel
    if (riskScore >= 0 && riskScore < 0.35) {
      riskLevel = 'SAFE'
    } else if (riskScore >= 0.35 && riskScore < 0.6) {
      riskLevel = 'CAUTION'
    } else {
      riskLevel = 'DANGER'
    }

    result.value = {
      riskLevel,
      riskScore,
      confidence: Math.max(0, Math.min(1, data.confidence)),
      context: data.context || 'Unknown',
      topWords: Array.isArray(data.top_words) ? data.top_words : [],
      summary: truncate(data.summary || '', SUMMARY_CHAR_CAP),
      fullSummary: data.summary || '',
    }

  } catch (error) {
    console.error('Analysis error:', error)
    errorMessage.value = 'Failed to analyze text. Check the API URL and that the Beanstalk service is up.'
  } finally {
    isAnalyzing.value = false
  }
}

function onQRCodeClick() {
  showQRTutorialPage.value = 1
}

function goToActionGuide() {
  router.push('/action-guide')
}
</script>

<style>
/* Responsive utilities */
@media (max-width: 640px) {
  .text-3xl {
    font-size: 1.875rem;
  }
}

@media (min-width: 768px) and (max-width: 1024px) {
  .text-4xl {
    font-size: 2.25rem;
  }
}
</style>
