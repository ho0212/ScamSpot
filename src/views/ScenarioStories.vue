<script setup>
import GameCard from '@/components/UI/GameCard.vue'
import scenario1Img from '@/assets/picture/scenario1.png'
import scenario2Img from '@/assets/picture/scenario2.png'
import scenario3Img from '@/assets/picture/scenario3.png'

const scenarios = [
  {
    title: 'Romance Scam',
    imgSrc: scenario1Img,
    alt: 'Romance Scam Scenario',
    route: '/simulation-scenarios/romance-scam',
    extraClasses: ''
  },
  {
    title: 'Investment Scam',
    imgSrc: scenario2Img,
    alt: 'Investment Scam Scenario',
    route: '/simulation-scenarios/investment-scam',
    extraClasses: ''
  },
  {
    title: 'Phishing Scam',
    imgSrc: scenario3Img,
    alt: 'Phishing Scam Scenario',
    route: '/simulation-scenarios/phishing-scam',
    extraClasses: ''
  }
]
</script>

<template>
  <div class="relative w-full min-h-screen bg-gray-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
    <!-- Page Title -->
    <div class="text-center mb-8 sm:mb-12">
      <h1
        class="text-black font-bold"
        style="font-family: 'League Spartan'; font-size: clamp(28px, 5vw, 48px)"
      >
        Scenario Stories
      </h1>
      <!-- <p class="text-gray-600 mt-2 text-lg">Choose your interactive learning experience</p> -->
    </div>

      <!-- Scenarios Section -->
      <div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <GameCard
            v-for="(scenario, index) in scenarios"
            :key="index"
            :title="scenario.title"
            :imgSrc="scenario.imgSrc"
            :alt="scenario.alt"
            :route="scenario.route"
            :class="scenario.extraClasses"
          />
        </div>
      </div>
    </div>

</template>
