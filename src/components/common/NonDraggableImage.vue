<template>
  <img class="non-draggable-image" src="your-image.jpg" alt="..." />
</template>

<style scoped>
  .non-draggable-image {
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
    user-drag: none;
  }
</style>