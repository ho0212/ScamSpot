<script setup>
import Button from '@/components/UI/Button.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function goToLearning() {
  router.push('/learning-module')
}

function goToDetector() {
  router.push('/scam-detector')
}
</script>

<template>
  <div class="relative w-full h-screen overflow-hidden">
    <!-- Mobile image -->
    <img
      src="@/assets/picture/homepage-mobile.png"
      alt="Hero"
      class="md:hidden absolute inset-0 w-full h-full object-cover"
    />
    <!-- Desktop image -->
    <img
      src="@/assets/picture/homepage.png"
      alt="Hero"
      class="hidden md:block absolute inset-0 w-full h-full object-cover"
    />

    <!-- Desktop/Tablet Layout (left side text) -->
    <div
      class="hidden md:flex relative z-10 flex-col justify-center h-full text-left"
      style="width: 50%; padding-left: 5%; min-width: 300px"
    >
      <h1
        class="text-black font-bold leading-tight"
        style="font-family: 'League Spartan'; font-size: clamp(30px, 5vw, 50px)"
      >
        STAY SAFE ONLINE:
      </h1>

      <h2
        class="text-black font-bold mt-2 leading-tight"
        style="font-family: 'League Spartan'; font-size: clamp(30px, 5vw, 50px)"
      >
        Learn To Spot Scam
      </h2>

      <p class="text-black mt-4 text-base md:text-lg lg:text-xl" style="max-width: 400px">
        Got a few minutes? Jump into our learning module and level-up your brain!
      </p>

      <Button text="LEARNING MODULE" class="mt-6" :onClick="goToLearning" />

      <p class="text-black mt-4 text-base md:text-lg lg:text-xl" style="max-width: 400px">
        In a rush? Run our scam detector for a quick scam check!
      </p>

      <Button text="SCAM DETECTOR" class="mt-6" :onClick="goToDetector" />
    </div>

    <!-- Mobile Layout (bottom overlay with lighter gradient) -->
    <div
      class="md:hidden absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/60 via-black/30 to-transparent p-6 text-center"
    >
      <h1
        class="text-white font-bold leading-tight mb-2"
        style="font-family: 'League Spartan'; font-size: clamp(24px, 6vw, 32px)"
      >
        STAY SAFE ONLINE:
      </h1>

      <h2
        class="text-white font-bold leading-tight mb-4"
        style="font-family: 'League Spartan'; font-size: clamp(24px, 6vw, 32px)"
      >
        Learn To Spot Scam
      </h2>

      <p class="text-white text-sm mb-4 leading-relaxed max-w-xs mx-auto">
        Got a few minutes? Jump into our learning module and level-up your brain!
      </p>

      <Button text="LEARNING MODULE" :onClick="goToLearning" class="mb-4"/>

      <p class="text-white text-sm mb-4 leading-relaxed max-w-xs mx-auto">
        In a rush? Run our scam detector for a quick scam check!
      </p>

      <Button text="SCAM DETECTOR" :onClick="goToDetector" />
    </div>
  </div>
</template>

<style>
body {
  margin: 0;
}
</style>
