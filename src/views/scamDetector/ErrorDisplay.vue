<template>
  <div
    v-if="errorMessage"
    class="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-3xl"
    v-html="sanitizeHtml(errorMessage)"
  ></div>
</template>

<script setup>
const props = defineProps({
  errorMessage: {
    type: String,
    default: ''
  }
})

// XSS Prevention - HTML sanitization for display
const sanitizeHtml = (html) => {
  if (typeof html !== 'string') return ''

  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/data:/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '')
}
</script>
