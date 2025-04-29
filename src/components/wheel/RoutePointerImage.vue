<template>
  <img class="non-draggable-image roulette-pointer-image" src="your-pointer-image.png" alt="pointer" />
</template>

<style scoped>
  .non-draggable-image {
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
    user-drag: none;
  }

  .roulette-pointer-image {
    position: absolute;
    z-index: 5;
    width: 17%;
    right: 6px;
    top: 15px;
  }
</style>