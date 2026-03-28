<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ScenarioEngine from '@/views/scenarios/ScenarioEngine.vue'
import { romanceScamData } from '@/data/scenarios/romance-scam.js'
import { investmentScamData } from '@/data/scenarios/investment-scam.js'
import { phishingScamData } from '@/data/scenarios/phishing-scam.js'

const router = useRouter()
const route = useRoute()

// Map route params to scenario data
const scenarioMap = {
  'romance-scam': romanceScamData,
  'investment-scam': investmentScamData,
  'phishing-scam': phishingScamData
}

// Get the scenario type from the route
const scenarioType = computed(() => {

  const path = route.path.split('/').pop()
  return path
})

const currentScenario = computed(() => scenarioMap[scenarioType.value])

const handleExit = () => {
  router.push('/simulation-scenarios')
}
</script>

<template>
  <ScenarioEngine
    v-if="currentScenario"
    :scenario-data="currentScenario"
    @exit="handleExit"
  />
  <div v-else class="min-h-screen flex items-center justify-center">
    <p class="text-xl text-gray-600">Scenario not found</p>
  </div>
</template>
