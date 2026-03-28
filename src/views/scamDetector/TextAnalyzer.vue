<template>
  <div class="flex flex-col w-full">
    <textarea
      v-model="localInputText"
      @input="handleInput"
      @paste="handlePaste"
      class="placeholder:text-center mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-3xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 min-h-[150px] max-h-[400px] resize-y overflow-auto"
      :placeholder="'Please insert SMS text or email content to check for scam'"
      :disabled="isAnalyzing"
      :maxlength="maxInputLength"
    ></textarea>

    <!-- Character Counwhatt Display -->
    <div class="text-sm text-gray-600 mt-1 text-right">
      {{ localInputText.length }} / {{ maxInputLength }} characters
    </div>

    <!-- Action Buttons -->
    <div class="flex mt-4" :class="isMobile ? 'gap-2' : 'gap-3'">
      <button
        @click="clearText"
        class="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 rounded-3xl transition-colors"
        :class="isMobile ? 'px-4' : 'px-6'"
      >
        Clear
      </button>
      <button
        @click="$emit('analyze', localInputText)"
        :disabled="isAnalyzing || !localInputText.trim()"
        class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 rounded-3xl transition-colors"
        :class="isMobile ? 'px-4' : 'px-6'"
      >
        {{ isAnalyzing ? 'Analyzing...' : 'Analyze for Scam' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  inputText: {
    type: String,
    default: ''
  },
  isAnalyzing: {
    type: Boolean,
    default: false
  },
  maxInputLength: {
    type: Number,
    default: 2000
  },
  isMobile: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:inputText', 'analyze', 'clearResults'])

const localInputText = ref(props.inputText)

// Watch for external changes to inputText prop
watch(() => props.inputText, (newVal) => {
  if (newVal !== localInputText.value) {
    localInputText.value = newVal
  }
})

// XSS Prevention - Input sanitization
const sanitizeInput = (text) => {
  if (typeof text !== 'string') return ''

  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/data:/gi, '')
    .replace(/\r?\n/g, '\n')
    .slice(0, props.maxInputLength)
}

const autoResize = (event) => {
  const textarea = event.target
  textarea.style.height = 'auto'
  textarea.style.height = textarea.scrollHeight + 'px'
}

const handleInput = (event) => {
  const sanitized = sanitizeInput(event.target.value)

  // Only update if sanitization changed the value
  if (sanitized !== event.target.value) {
    localInputText.value = sanitized
    nextTick(() => {
      // Reset cursor position after sanitization
      const cursorPos = Math.min(event.target.selectionStart, sanitized.length)
      event.target.setSelectionRange(cursorPos, cursorPos)
    })
  } else {
    localInputText.value = sanitized
  }

  emit('update:inputText', sanitized)
  emit('clearResults')
  autoResize(event)
}

const handlePaste = (event) => {
  event.preventDefault()

  const paste = (event.clipboardData || window.clipboardData).getData('text')
  const textarea = event.target
  const start = textarea.selectionStart
  const end = textarea.selectionEnd

  // Get current text and insert pasted content at cursor position
  const currentText = localInputText.value
  const beforeCursor = currentText.substring(0, start)
  const afterCursor = currentText.substring(end)
  const newText = beforeCursor + paste + afterCursor

  // Sanitize the complete new text
  const sanitized = sanitizeInput(newText)

  localInputText.value = sanitized
  emit('update:inputText', sanitized)
  emit('clearResults')

  nextTick(() => {
    // Set cursor position after the pasted content
    const newCursorPos = Math.min(start + paste.length, sanitized.length)
    textarea.setSelectionRange(newCursorPos, newCursorPos)
    autoResize({ target: textarea })
  })
}

const clearText = () => {
  localInputText.value = ''
  emit('update:inputText', '')
  emit('clearResults')
}
</script>
