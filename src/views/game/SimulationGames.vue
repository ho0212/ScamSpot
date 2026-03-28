<script setup>
import GameCard from '@/components/UI/GameCard.vue'
import tfImg from '@/assets/picture/tf.png'
import clueImg from '@/assets/picture/clue.png'
import matchImg from '@/assets/picture/match.png'

const games = [
  {
    title: 'True or False',
    imgSrc: tfImg,
    alt: 'True or false',
    route: '/simulation-games/true-or-false',
    extraClasses: ''
  },
  {
    title: 'Choose the Clue',
    imgSrc: clueImg,
    alt: 'Choose the Clue',
    route: '/simulation-games/choose-the-clue',
    extraClasses: ''
  },
  {
    title: 'Click and Match',
    imgSrc: matchImg,
    alt: 'Click and Match',
    route: '/simulation-games/click-and-match',
    extraClasses: 'sm:col-span-2 lg:col-span-1'
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
        Choose Your Game
      </h1>
    </div>

    <!-- Game Cards -->
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <GameCard
          v-for="(game, index) in games"
          :key="index"
          :title="game.title"
          :imgSrc="game.imgSrc"
          :alt="game.alt"
          :route="game.route"
          :class="game.extraClasses"
        />
      </div>
    </div>
  </div>
</template>
