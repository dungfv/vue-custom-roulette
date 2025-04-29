<template>
  <div class="rotation-container" :class="{ 'started-spinning': isSpinning }" :style="rotationStyle"></div>

  <style v-html="dynamicKeyframes"></style>
</template>

<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    startRotationDegrees: Number,
    finalRotationDegrees: Number,
    startSpinningTime: Number,
    continueSpinningTime: Number,
    stopSpinningTime: Number,
    disableInitialAnimation: Boolean,
    classKey: String,
    isSpinning: Boolean,
  })

  const rotationStyle = computed(() => ({
    position: 'absolute',
    width: '100%',
    left: '0px',
    right: '0px',
    top: '0px',
    bottom: '0px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transform: `rotate(${props.startRotationDegrees}deg)`,
    animation: props.isSpinning
      ? [
        `spin-${props.classKey} ${props.startSpinningTime / 1000}s cubic-bezier(0.71, ${props.disableInitialAnimation ? 0 : -0.29
        }, 0.96, 0.9) 0s 1 forwards`,
        `continueSpin-${props.classKey} ${props.continueSpinningTime / 1000}s linear ${props.startSpinningTime / 1000
        }s 1 forwards`,
        `stopSpin-${props.classKey} ${props.stopSpinningTime / 1000}s cubic-bezier(0, 0, 0.35, 1.02) ${(props.startSpinningTime + props.continueSpinningTime) / 1000
        }s 1 forwards`,
      ].join(', ')
      : 'none',
  }))

  const dynamicKeyframes = computed(() => {
    const s = props.startRotationDegrees
    const f = props.finalRotationDegrees
    const key = props.classKey

    return `
      @keyframes spin-${key} {
        from { transform: rotate(${s}deg); }
        to { transform: rotate(${s + 360}deg); }
      }
  
      @keyframes continueSpin-${key} {
        from { transform: rotate(${s}deg); }
        to { transform: rotate(${s + 360}deg); }
      }
  
      @keyframes stopSpin-${key} {
        from { transform: rotate(${s}deg); }
        to { transform: rotate(${1440 + f}deg); }
      }
    `
  })
</script>

<style scoped>
  .rotation-container {
    will-change: transform;
  }
</style>