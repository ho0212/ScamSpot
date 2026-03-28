<template>
  <div v-if="result" class="mt-6">
    <div
      :class="[
        'text-white p-4 rounded-3xl text-center',
        result.riskLevel === 'SAFE' ? 'bg-green-600' :
        result.riskLevel === 'CAUTION' ? 'bg-orange-400' : 'bg-red-600'
      ]"
    >
      <h3 class="font-bold text-lg mb-2">
        {{ getRiskTitle(result.riskLevel) }}
      </h3>
      <p class="mb-2">
        {{ getRiskMessage(result.riskLevel) }}
      </p>

      <!-- Summary (plain-language explanation) -->
      <div v-if="displaySummary" class="bg-white/15 rounded-2xl mt-4 px-3 py-3 text-left">
        <p class="text-sm leading-relaxed">
          {{ displaySummary }}
        </p>

        <!-- Show more / less toggle if long -->
        <button
          v-if="hasLongSummary"
          class="mt-2 text-xs underline opacity-90 hover:opacity-100"
          @click="expanded = !expanded"
        >
          {{ expanded ? 'Show less' : 'Show more' }}
        </button>
      </div>

      <!-- Fallback if no summary available -->
      <p v-else class="mt-4 text-sm italic opacity-90">
        No explanation available.
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  result: {
    type: Object,
    default: null
  },
  // Optional prop to override the truncation cap
  summaryCap: {
    type: Number,
    default: 320
  }
})

const expanded = ref(false)

const getRiskTitle = (riskLevel) => {
  switch (riskLevel) {
    case 'SAFE': return '✅ APPEARS LEGITIMATE'
    case 'CAUTION': return '⚠️ BE CAREFUL!'
    default: return '🚨 SCAM DETECTED'
  }
}

const getRiskMessage = (riskLevel) => {
  switch (riskLevel) {
    case 'SAFE':
      return 'This message appears safe. You can likely trust it.'
    case 'CAUTION':
      return 'This message needs your attention. Double-check before clicking anything or sharing personal information.'
    default:
      return 'This message is very suspicious! Do NOT click any links, download anything, or give out your personal information.'
  }
}

const fullSummary = computed(() => props.result?.summary || '')

const hasLongSummary = computed(() => fullSummary.value.length > props.summaryCap)

const displaySummary = computed(() => {
  if (!fullSummary.value) return ''
  if (expanded.value || !hasLongSummary.value) return fullSummary.value
  // soft cap
  return fullSummary.value.slice(0, props.summaryCap - 1).trimEnd() + '…'
})
</script>
