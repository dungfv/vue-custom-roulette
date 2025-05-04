<template>
  <img 
    class="non-draggable-image roulette-pointer-image" 
    :src="src || Pointer"
    :style="style || {}"
    alt="pointer" />
</template>

<script lang="ts" setup>
  import Pointer from './../../assets/roulette-pointer.png'
  import type { PointerProps } from './types';

  const { src, style } = defineProps<PointerProps>()
</script>

<style scoped>
  .non-draggable-image {
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
  }

  .roulette-pointer-image {
    position: absolute;
    z-index: 5;
    width: 17%;
    right: 6px;
    top: 15px;
  }
</style>