<template>
  <img
    :src="src || Pointer"
    style="position: absolute; z-index: 5; width: 17%; right: 6px; top: 15px;"
    :style="style || {}"
    alt="pointer"
  />
</template>

<script lang="ts" setup>
  import type { PointerProps } from '../../../types'
  import Pointer from './../../assets/pointer.svg'

  const { src, style } = defineProps<PointerProps>()
</script>