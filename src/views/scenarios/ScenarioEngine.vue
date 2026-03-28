<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  scenarioData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['exit'])

const currentScene = ref('intro')
const history = ref([])
const redFlags = ref([])

const addRedFlag = (flag) => {
  if (!redFlags.value.includes(flag)) {
    redFlags.value.push(flag)
  }
}

const goToScene = (nextScene, isGoodChoice) => {
  history.value.push(currentScene.value)
  currentScene.value = nextScene

  if (!isGoodChoice && nextScene !== 'intro') {
    const scene = props.scenarioData.scenes[nextScene]
    if (scene?.redFlag) {
      addRedFlag(scene.redFlag)
    }
  }
}

const goBack = () => {
  if (history.value.length > 0) {
    const previousScene = history.value[history.value.length - 1]
    currentScene.value = previousScene
    history.value = history.value.slice(0, -1)
  }
}

const handleExit = () => {
    emit('exit')
}

const resetScenario = () => {
  currentScene.value = 'intro'
  history.value = []
  redFlags.value = []
}

const currentScenario = computed(() => props.scenarioData.scenes[currentScene.value])
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden" style="height: 667px">
      <!-- Header -->
      <div :class="[scenarioData.theme.headerGradient, 'text-white p-4']">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <button
              v-if="history.length > 0 && currentScenario.type !== 'intro' && currentScenario.type !== 'result'"
              @click="goBack"
              class="p-1 hover:bg-white/20 rounded-full transition-all"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 class="font-bold text-lg">{{ scenarioData.title }}</h1>
          </div>
          <button @click="handleExit" class="p-1 hover:bg-white/20 rounded-full transition-all">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Content Area -->
      <div class="h-[calc(100%-56px)] overflow-y-auto">
        <!-- Intro Page -->
        <div v-if="currentScenario.type === 'intro'" class="p-6 space-y-6">
          <div class="text-center">
            <div :class="[scenarioData.theme.iconBg, 'w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4']">
              <svg :class="[scenarioData.theme.iconColor, 'w-10 h-10']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path :d="scenarioData.theme.iconPath" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-800 mb-2">{{ scenarioData.title }}</h2>
            <p class="text-gray-600">{{ scenarioData.subtitle }}</p>
          </div>

          <div class="bg-blue-50 rounded-lg p-4 space-y-3">
            <h3 class="font-semibold text-blue-900 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              How to Play
            </h3>
            <ul class="space-y-2 text-sm text-blue-800">
              <li v-for="(item, idx) in scenarioData.howToPlay" :key="idx" class="flex gap-2">
                <span>•</span>
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>

          <button
            @click="goToScene(scenarioData.firstScene, true)"
            :class="[scenarioData.theme.buttonGradient, 'w-full text-white font-semibold py-4 rounded-lg hover:opacity-90 transition-all shadow-lg']"
          >
            Start Scenario
          </button>
        </div>

        <!-- Chat Scene -->
        <div v-if="currentScenario.type === 'chat'" class="flex flex-col h-full">
          <div class="bg-gray-100 text-center py-2 px-4 text-sm text-gray-600 border-b">
            {{ currentScenario.context }}
          </div>

          <div class="flex-1 p-4 space-y-4 bg-gray-50">
            <div class="flex gap-3 items-start">
              <div class="text-3xl">{{ currentScenario.avatar }}</div>
              <div class="flex-1">
                <div class="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm">
                  <p class="font-semibold text-sm text-gray-900 mb-1">{{ currentScenario.character }}</p>
                  <div class="text-gray-800 text-sm leading-relaxed whitespace-pre-line" v-html="currentScenario.message"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="p-4 bg-white border-t space-y-3">
            <p class="text-sm text-gray-600 font-medium">How do you respond?</p>
            <button
              v-for="(option, index) in currentScenario.options"
              :key="index"
              @click="goToScene(option.next, option.safe)"
              class="w-full text-left p-4 rounded-xl transition-all transform hover:scale-[1.02] bg-gray-50 border-2 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
            >
              <p class="text-sm text-gray-800">{{ option.text }}</p>
            </button>
          </div>
        </div>

        <!-- Result Screen -->
        <div v-if="currentScenario.type === 'result'" class="p-6 space-y-6">
          <div class="text-center">
            <div :class="[currentScenario.outcome === 'safe' ? 'bg-green-100' : 'bg-red-100', 'w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4']">
              <svg v-if="currentScenario.outcome === 'safe'" class="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else class="w-16 h-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 :class="[currentScenario.outcome === 'safe' ? 'text-green-800' : 'text-red-800', 'text-2xl font-bold mb-2']">
              {{ currentScenario.title }}
            </h2>
            <p class="text-gray-600">{{ currentScenario.description }}</p>
          </div>

          <div v-for="(section, idx) in currentScenario.sections" :key="idx" :class="[section.bgColor, 'rounded-lg p-4 space-y-3']">
            <h3 :class="[section.textColor, 'font-semibold', section.hasIcon ? 'flex items-center gap-2' : '']">
              <svg v-if="section.hasIcon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {{ section.heading }}
            </h3>
            <p v-if="section.content" :class="['text-sm', section.contentColor || section.textColor]">
              {{ section.content }}
            </p>
            <ul v-if="section.list" class="space-y-2 text-sm">
              <li v-for="(item, i) in section.list" :key="i" :class="['flex gap-2', section.listColor || section.textColor]">
                <svg v-if="section.listStyle === 'check'" class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg v-if="section.listStyle === 'warning'" class="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span v-if="section.listStyle === 'bullet'">•</span>
                <span v-if="section.listStyle === 'number'">{{ i + 1 }}.</span>
                <span v-if="section.listStyle === 'cross'" class="text-amber-600 font-bold">✗</span>
                <span>{{ item }}</span>
              </li>
            </ul>
            <div v-if="section.nestedSection" class="bg-white rounded p-3 mt-3">
              <p :class="['text-sm font-semibold mb-2', section.nestedSection.textColor]">
                {{ section.nestedSection.heading }}
              </p>
              <ul class="space-y-1 text-sm">
                <li v-for="(item, i) in section.nestedSection.list" :key="i" :class="section.nestedSection.listColor">
                  • {{ item }}
                </li>
              </ul>
            </div>
          </div>

          <div class="flex gap-3">
            <button
              @click="resetScenario"
              class="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-all"
            >
              {{ currentScenario.outcome === 'safe' ? 'Play Again' : 'Try Again' }}
            </button>
            <button
              @click="handleExit"
              class="flex-1 bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg hover:bg-gray-300 transition-all"
            >
              Exit
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
