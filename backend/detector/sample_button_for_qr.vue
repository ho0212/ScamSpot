<template>
  <div>
    <button @click="fetchQR">Generate Unique QR</button>
    <div v-if="qrUrl">
      <img :src="qrUrl" alt="QR Code" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      qrUrl: null
    };
  },
  methods: {
    fetchQR() {
      // Force a new QR every time (timestamp prevents caching)
      this.qrUrl = `http://127.0.0.1:8000/generate-qr?time=${Date.now()}`;
    }
  }
};
</script>
