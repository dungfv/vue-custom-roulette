<template>
  <div 
    class="rotation-container" 
    :class="[ isSpinning ? 'started-spinning' : '', className ]" 
    :style="containerStyle">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, onMounted, watch } from 'vue';

const props = defineProps<{
  className: string;
  startRotationDegrees: number;
  classKey: string;
  startSpinningTime: number;
  continueSpinningTime: number;
  stopSpinningTime: number;
  disableInitialAnimation: boolean;
  finalRotationDegrees: number;
  isSpinning: boolean;
}>()

const containerStyle = computed(() => {
  const baseStyle = {
    transform: `rotate(${props.startRotationDegrees}deg)`
  };

  if (props.isSpinning) {
    return {
      ...baseStyle,
      animation: `
        spin-${props.classKey} ${props.startSpinningTime / 1000}s cubic-bezier(0.71, ${props.disableInitialAnimation ? 0 : -0.29}, 0.96, 0.9) 0s 1 normal forwards running,
        continueSpin-${props.classKey} ${props.continueSpinningTime / 1000}s linear ${props.startSpinningTime / 1000}s 1 normal forwards running,
        stopSpin-${props.classKey} ${props.stopSpinningTime / 1000}s cubic-bezier(0, 0, 0.35, 1.02) ${(props.startSpinningTime + props.continueSpinningTime) / 1000}s 1 normal forwards running
      `
    };
  }
  
  return baseStyle;
})

const cssKeyframes = computed(() => {
  return `
    @keyframes spin-${props.classKey} {
      from {
        transform: rotate(${props.startRotationDegrees}deg);
      }
      to {
        transform: rotate(${props.startRotationDegrees + 360}deg);
      }
    }
    @keyframes continueSpin-${props.classKey} {
      from {
        transform: rotate(${props.startRotationDegrees}deg);
      }
      to {
        transform: rotate(${props.startRotationDegrees + 360}deg);
      }
    }
    @keyframes stopSpin-${props.classKey} {
      from {
        transform: rotate(${props.startRotationDegrees}deg);
      }
      to {
        transform: rotate(${1440 + props.finalRotationDegrees}deg);
      }
    }
  `;
})
const styleElement = document.createElement('style');
styleElement.type = 'text/css';
styleElement.innerHTML = cssKeyframes.value;
document.head.appendChild(styleElement);

onMounted(() => {
  if (styleElement) {
    document.head.appendChild(styleElement);
  }
})

onBeforeMount(() => {
  if (styleElement) {
    document.head.removeChild(styleElement);
  }
})

watch(
  () => props.isSpinning,
  (newValue) => {
    if (newValue) {
      styleElement.innerHTML = cssKeyframes.value;
    }
  }
);
</script>

<style scoped>
.rotation-container {
  position: absolute;
  width: 100%;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>