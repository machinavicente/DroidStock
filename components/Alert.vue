<template>
  <div v-if="visible" :class="[
    'p-4 rounded-lg mb-4 flex items-center justify-between',
    type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : '',
    type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : '',
    type === 'warning' ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' : '',
    type === 'info' ? 'bg-blue-50 text-blue-800 border border-blue-200' : ''
  ]">
    <div class="flex items-center">
      <i :class="[
        'text-xl mr-3',
        type === 'success' ? 'ri-checkbox-circle-fill' : '',
        type === 'error' ? 'ri-alert-fill' : '',
        type === 'warning' ? 'ri-error-warning-fill' : '',
        type === 'info' ? 'ri-information-fill' : ''
      ]"></i>
      <span class="text-sm">{{ message }}</span>
    </div>
    <button @click="visible = false" class="ml-4">
      <i class="ri-close-line text-xl"></i>
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  message: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'info'
  }
})

const visible = ref(true)

// Actualizar visibilidad cuando cambia el mensaje
watch(() => props.message, () => {
  visible.value = true
})
</script>