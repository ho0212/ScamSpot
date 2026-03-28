<template>
  <div
    class="absolute top-0 bg-blue-900 rounded-xl p-2 z-10 w-80 md:w-96 left-1/2 transform -translate-x-1/2 mt-4"
    v-show="currentPage > 0"
  >
    <div class="absolute font-bold text-2xl top-1 right-4 text-blue-900">
      <button
        @click="$emit('update:currentPage', 0)"
        >x
      </button>
    </div>

    <!-- QR code tutorial page 1 -->
    <div
      class="bg-white w-full h-full size-64 rounded-xl p-2 text-center"
      v-show="currentPage === 1"
    >
      <div class="py-3">
        <span class="block">Open your camera application in your phone</span>

        <div class="camera-icons flex flex-1 mt-10">
          <img class="small-img" src="@/assets/picture/camera_icon_1.png" />
          <img class="small-img" src="@/assets/picture/camera_icon_2.png" />
          <img class="small-img" src="@/assets/picture/camera_icon_3.png" />
        </div>

        <span class="block mt-10">Usually it looks like icons above</span>

        <div class="text-center">
          <button
            @click="$emit('update:currentPage', totalPages)"
            class="mt-4 mx-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl transition-colors"
          >
            Skip
          </button>
          <button
            @click="$emit('update:currentPage', currentPage + 1)"
            class="mt-4 mx-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- QR code tutorial page 2 -->
    <div
      class="bg-white w-full h-full size-64 rounded-xl p-2 text-center"
      v-show="currentPage === 2"
    >
      <div class="py-3">
        <span class="block">Scan the <strong>QR code</strong></span>

        <div class="flex flex-1">
          <img src="@/assets/picture/qr_tutorial_search.png" />
        </div>

        <div class="text-center">
          <button
            @click="$emit('update:currentPage', currentPage - 1)"
            class="mt-4 mx-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl transition-colors"
          >
            Back
          </button>
          <button
            @click="$emit('update:currentPage', currentPage + 1)"
            class="mt-4 mx-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- QR code tutorial page 3 -->
    <div
      class="bg-white w-full h-full size-64 rounded-xl p-2 text-center"
      v-show="currentPage === 3"
    >
      <div class="py-3">
        <span class="block">Then, it will directly open our website in your phone</span>

        <div class="flex flex-1">
          <img src="@/assets/picture/qr_tutorial_web_phone.png" />
        </div>

        <div class="text-center">
          <button
            @click="$emit('update:currentPage', currentPage - 1)"
            class="mt-4 mx-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl transition-colors"
          >
            Back
          </button>
          <button
            @click="$emit('update:currentPage', currentPage + 1)"
            class="mt-4 mx-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- QR code tutorial page 4 -->
    <div
      class="bg-white w-full h-full size-64 rounded-xl p-2 text-center"
      v-show="currentPage === 4"
    >
      <div class="py-3">
        <span class="block"
          >If you want to copy the scam message from your phone, click and hold the text box that
          has no text around it.</span
        >

        <div class="flex flex-1">
          <img src="@/assets/picture/qr_tutorial_phone_copy.png" />
        </div>

        <div class="text-center">
          <button
            @click="$emit('update:currentPage', currentPage - 1)"
            class="mt-4 mx-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl transition-colors"
          >
            Back
          </button>
          <button
            @click="$emit('update:currentPage', currentPage + 1)"
            class="mt-4 mx-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- QR code tutorial page 5 -->
    <div
      class="bg-white w-full h-full size-64 rounded-xl p-2 text-center"
      v-show="currentPage === 5"
    >
      <div class="py-3">
        <span class="block"
          >It will show the menu bar. After that, click the copy option from your phone. Then it
          will copy the text</span
        >

        <div class="flex flex-1">
          <img src="@/assets/picture/qr_tutorial_phone_menubar.png" />
        </div>

        <div class="text-center">
          <button
            @click="$emit('update:currentPage', currentPage - 1)"
            class="mt-4 mx-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl transition-colors"
          >
            Back
          </button>
          <button
            @click="$emit('update:currentPage', currentPage + 1)"
            class="mt-4 mx-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- QR code tutorial page 6 -->
    <div
      class="bg-white w-full h-full size-64 rounded-xl p-2 text-center"
      v-show="currentPage === 6"
    >
      <div class="py-3">
        <span class="block">Go back to our web page, and paste the text in the text box.</span>

        <div class="flex flex-1">
          <img src="@/assets/picture/qr_tutorial_web_paste.png" />
        </div>

        <div class="text-center">
          <button
            @click="$emit('update:currentPage', currentPage - 1)"
            class="mt-4 mx-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl transition-colors"
          >
            Back
          </button>
          <button
            @click="$emit('update:currentPage', currentPage + 1)"
            class="mt-4 mx-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- QR code tutorial final page -->
    <div
      class="w-full h-full rounded-xl text-center"
      v-show="currentPage === totalPages"
    >
      <span class="block mt-2 text-white uppercase font-bold">Scan this QR Code</span>
      <span class="block text-white font-light">To connect to your phone</span>

      <div class="qr_code_container p-3 flex flex-1 flex-col items-center">
        <img class="max-h-72" src="@/assets/picture/qr_code_detector.svg" />
      </div>

      <button
        @click="$emit('update:currentPage', 0)"
        class="mb-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl transition-colors"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  currentPage: {
    type: Number,
    default: 0
  },
  totalPages: {
    type: Number,
    default: 7
  }
})

defineEmits(['update:currentPage'])
</script>

<style scoped>
.camera-icons img {
  padding: 0 10px;
}
</style>
