<script setup>
defineProps({
  title: String,
  imgSrc: String,
  alt: String,
  route: String
})
</script>

<template>
  <div
    class="bg-white rounded-lg border-2 sm:border-4 border-blue-900 cursor-pointer
           transform transition-all duration-300 hover:scale-105 hover:shadow-xl
           mx-auto w-full max-w-sm lg:max-w-none"
    @click="$router.push(route)"
  >
    <div class="p-4 sm:p-6">
      <img
        :src="imgSrc"
        :alt="alt"
        class="w-full h-32 sm:h-40 lg:h-48 object-contain rounded-lg mb-3 sm:mb-4"
      />
      <h3
        class="text-center font-bold text-gray-800"
        style="font-family: 'League Spartan'; font-size: clamp(20px, 4vw, 28px)"
      >
        {{ title }}
      </h3>
    </div>
  </div>
</template>
