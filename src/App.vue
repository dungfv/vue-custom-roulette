<script setup lang="ts">
  import { ref } from 'vue'
  import Wheel from './components/wheel/Index.vue'
  import Pointer from './assets/pointer.svg'

  const data = [
    {
      option: 'Free shipping',
      style: {
        backgroundColor: 'blue',
        textColor: '#ffffff',
        fontSize: 11,
        fontFamily: 'sans-serif'
      }
    },
    {
      option: '5% off',
      style: {
        backgroundColor: 'red',
        textColor: '#333faa',
        fontSize: 10
      }
    },
    {
      option: '10% off',
      style: {
        backgroundColor: 'green',
        textColor: '#333faa',
        fontSize: 10
      }
    },
    {
      option: '15% off',
      style: {
        backgroundColor: 'violet',
        textColor: '#333faa',
        fontSize: 10
      }
    },
    {
      option: 'No luck',
      style: {
        backgroundColor: 'yellow',
        textColor: '#333faa',
        fontSize: 10
      }
    },
  ]
  const spinning = ref(false)
  const spin = () => {
    spinning.value = !spinning.value
  }
</script>

<template>
  <div style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;">
    <div style="height: 622px; height: 622px;">
      <Wheel :data="[...data, ...data]"
        :prizeNumber="2" 
        :mustStartSpinning="spinning" 
        :innerRadius="15" 
        innerBorderColor="#e0e0e0"
        :innerBorderWidth="0" 
        radiusLineColor="#eeeeee"
        :radiusLineWidth="1"
        outerBorderColor="#eeeeee"
        :outerBorderWidth="0"
        :fontSize="16" 
        :backgroundColors="['#c23f33', '#122433']"
        :textColors="['#ffffff', '#ffffff']"
        :spinDuration="0.5" 
        :startingOptionIndex="0" 
        :pointerProps="{
          src: Pointer,
          style: {
            // width: '100%',
            // right: '20px',
            // top: '40px',
          }
        }" />
    </div>
  </div>
  <button style="padding: 10px; background-color: #4CAF50;" @click="spin">Spin</button>
</template>
