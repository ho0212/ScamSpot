<template>
  <div class="mt-10">
    <!-- App Description -->
    <div class="bg-blue-900 text-white p-2.5 rounded-3xl">
      {{ isMobile ? mobileDescription : desktopDescription }}
    </div>

    <!-- User Guide Section -->
    <div class="mt-6">
      <p
        class="text-black font-bold text-center"
        :class="isMobile ? '' : 'text-lg'"
        style="font-family: 'League Spartan'"
      >
        Got scammed? Click below for next steps.
      </p>
      <div class="flex justify-center" :class="isMobile ? 'mt-3' : 'mt-4'">
        <button
          @click="$emit('navigate-to-guide')"
          class="bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-3xl transition-colors"
          style="font-family: 'League Spartan'"
        >
          WHAT'S NEXT
        </button>
      </div>
    </div>

    <!-- QR Code Section -->
   <div
      v-if="showQRSection && !isMobile"
      class="mt-10 flex flex-col items-center text-center uppercase text-sm"
    >
      <span
        class="mb-2 text-black font-bold max-w-32"
        style="font-family: 'League Spartan'"
      >
        Is the scam message on your phone?
      </span>
      <div
        @click="$emit('qr-click')"
        class="bg-blue-900 p-2 rounded cursor-pointer hover:bg-blue-800 transition-colors"
      >
        <img
          class="w-16 h-16"
          :src="qrCodeDetector"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
// Import images
import qrCodeHome from '@/assets/picture/qr_code_home.svg'
import qrCodeDetector from '@/assets/picture/qr_code_detector.svg'

const props = defineProps({
  isMobile: {
    type: Boolean,
    default: false
  },
  showQRSection: {
    type: Boolean,
    default: true
  }
})

defineEmits(['navigate-to-guide', 'qr-click'])

const mobileDescription = 'Scam detection model is an AI powered tool designed to detect scam messages. By using this tool, it is expected users will decrease the probability to get scammed'

const desktopDescription = 'The Scam Detection Model is an AI-powered tool designed to identify scam messages and reduce your risk of falling victim to fraud.'
</script>
