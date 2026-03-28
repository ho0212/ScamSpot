<script setup>
defineProps({
  text: { type: String, required: true },
  onClick: Function,
})
</script>

<template>
  <button
    class="bg-blue-900 text-white font-bold px-6 py-3 w-52 rounded-3xl shadow-lg hover:bg-blue-800 hover:shadow-xl transition-all duration-300"
    @click="onClick && onClick()"
    style="font-family: 'Poppins', sans-serif"
  >
    {{ text }}
  </button>
</template>
