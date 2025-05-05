<template>
  <div
    v-if="isDataUpdated"
    class="roulette_container"
    style="position: relative; width: 622px; max-width: 622px; height: 622px; max-height: 622px; object-fit: contain; flex-shrink: 0; z-index: 50; pointer-events: none;">
    <RotationContainer 
      :className="getRouletteClass()"
      :class-key="classKey"
      :startRotationDegrees="startRotationDegrees"
      :finalRotationDegrees="finalRotationDegrees"
      :startSpinningTime="startSpinningTime" :continueSpinningTime="continueSpinningTime"
      :stopSpinningTime="stopSpinningTime" :disableInitialAnimation="disableInitialAnimation || DISABLE_INITIAL_ANIMATION"
      :is-spinning="hasStartedSpinning">
      <WheelCanvas
      width="622px"
        height="622px"
        :data="wheelData"
        :outerBorderColor="props.outerBorderColor || DEFAULT_OUTER_BORDER_COLOR"
        :outerBorderWidth="props.outerBorderWidth || DEFAULT_OUTER_BORDER_WIDTH"
        :innerRadius="props.innerRadius || DEFAULT_INNER_RADIUS"
        :innerBorderColor="props.innerBorderColor || DEFAULT_INNER_BORDER_COLOR"
        :innerBorderWidth="props.innerBorderWidth || DEFAULT_INNER_BORDER_WIDTH"
        :radiusLineColor="props.radiusLineColor || DEFAULT_RADIUS_LINE_COLOR"
        :radiusLineWidth="props.radiusLineWidth || DEFAULT_RADIUS_LINE_WIDTH"
        :fontFamily="props.fontFamily || DEFAULT_FONT_FAMILY"
        :fontWeight="props.fontWeight || DEFAULT_FONT_WEIGHT"
        :fontSize="props.fontSize || DEFAULT_FONT_SIZE"
        :fontStyle="props.fontStyle || DEFAULT_FONT_STYLE"
        :perpendicularText="props.perpendicularText"
        :prizeMap="prizeMap"
        :rouletteUpdater="rouletteUpdater"
        :textDistance="props.textDistance || DEFAULT_TEXT_DISTANCE"
      />
    </RotationContainer>
    <RoutePointerImage 
      v-bind="pointerProps"
    />

  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref, watch } from 'vue'
  import WebFont from 'webfontloader'
  import RotationContainer from './RotationContainer.vue'
  import WheelCanvas from './../canvas/Index.vue'
  
  const STARTED_SPINNING = 'started-spinning';

  const START_SPINNING_TIME = 2600;
  const CONTINUE_SPINNING_TIME = 750;
  const STOP_SPINNING_TIME = 8000;
  import {
    DEFAULT_BACKGROUND_COLORS,
    DEFAULT_FONT_FAMILY,
    DEFAULT_FONT_SIZE,
    DEFAULT_FONT_STYLE,
    DEFAULT_FONT_WEIGHT,
    DEFAULT_INNER_BORDER_COLOR,
    DEFAULT_INNER_BORDER_WIDTH,
    DEFAULT_INNER_RADIUS,
    DEFAULT_OUTER_BORDER_COLOR,
    DEFAULT_OUTER_BORDER_WIDTH,
    DEFAULT_RADIUS_LINE_COLOR,
    DEFAULT_RADIUS_LINE_WIDTH,
    DEFAULT_SPIN_DURATION,
    DEFAULT_TEXT_COLORS,
    DEFAULT_TEXT_DISTANCE,
    WEB_FONTS,
    DISABLE_INITIAL_ANIMATION,
  } from '../../constant'
  import { getQuantity, getRotationDegrees, isCustomFont, makeClassKey } from '../../utils'
  import RoutePointerImage from './RoutePointerImage.vue'
  import type { SpinWheelProps, WheelData } from '../../../types'

  const props = defineProps<SpinWheelProps>()

  const wheelData = ref<WheelData[]>([...props.data]);
  const prizeMap = ref<number[][]>([[0]]);
  const startRotationDegrees = ref(0);
  const finalRotationDegrees = ref(0);
  const hasStartedSpinning = ref(false);
  const hasStoppedSpinning = ref(false);
  const isCurrentlySpinning = ref(false);
  const isDataUpdated = ref(false);
  const rouletteUpdater = ref(false);
  const loadedImagesCounter = ref(0);
  const totalImages = ref(0);
  const isFontLoaded = ref(false);
  const mustStopSpinning = ref<boolean>(false);

  const classKey = makeClassKey(5);
  const normalizedSpinDuration = Math.max(0.01, props.spinDuration || DEFAULT_SPIN_DURATION);

  const startSpinningTime = START_SPINNING_TIME * normalizedSpinDuration;
  const continueSpinningTime = CONTINUE_SPINNING_TIME * normalizedSpinDuration;
  const stopSpinningTime = STOP_SPINNING_TIME * normalizedSpinDuration;

  const totalSpinningTime =
    startSpinningTime + continueSpinningTime + stopSpinningTime;

  const startSpinning = () => {
    hasStartedSpinning.value = true;
    hasStoppedSpinning.value = false;
    mustStopSpinning.value = true;
    setTimeout(() => {
      if (mustStopSpinning.value) {
        mustStopSpinning.value = false;
        hasStartedSpinning.value = false
        hasStoppedSpinning.value = true
        if (props.onStopSpinning) {
          props.onStopSpinning();
        }
      }
    }, totalSpinningTime);
  };

  watch(() => props.mustStartSpinning, () => {
    if (props.mustStartSpinning && !isCurrentlySpinning.value) {
      isCurrentlySpinning.value = true
      startSpinning();
      const selectedPrize =
        prizeMap.value[props.prizeNumber][
          Math.floor(Math.random() * prizeMap.value[props.prizeNumber]?.length)
        ];
      const finalRotationDegreesCalculated = getRotationDegrees(
        selectedPrize || 0,
        getQuantity(prizeMap.value)
      );
      finalRotationDegrees.value = finalRotationDegreesCalculated
    }
  });

  watch(() => hasStartedSpinning.value, () => {
    if (hasStartedSpinning.value) {
      isCurrentlySpinning.value = false
      startRotationDegrees.value = finalRotationDegrees.value
    }
  })

  onMounted(() => {
    let initialMapNum = 0;
    const auxPrizeMap: number[][] = [];
    const dataLength = props.data?.length || 0;
    const wheelDataAux = [{ option: '', optionSize: 1 }] as WheelData[];
    const fontsToFetch = isCustomFont((props.fontFamily || WEB_FONTS[0])?.trim()) ? [props.fontFamily || WEB_FONTS[0]] : [];

    for (let i = 0; i < dataLength; i++) {
      let fontArray = props.data[i]?.style?.fontFamily?.split(',') || [];
      fontArray = fontArray.map(font => font.trim()).filter(isCustomFont);
      fontsToFetch.push(...fontArray);

      wheelDataAux[i] = {
        ...props.data[i],
        style: {
          backgroundColor:
            props.data[i].style?.backgroundColor ||
            props.backgroundColors?.[i % props.backgroundColors?.length] ||
            DEFAULT_BACKGROUND_COLORS[0],
          fontFamily:
            props.data[i].style?.fontFamily || props.fontFamily || DEFAULT_FONT_FAMILY,
          fontSize: props.data[i].style?.fontSize || props.fontSize || DEFAULT_FONT_SIZE,
          fontWeight:
            props.data[i].style?.fontWeight || props.fontWeight || DEFAULT_FONT_WEIGHT,
          fontStyle:
            props.data[i].style?.fontStyle || props.fontStyle || DEFAULT_FONT_STYLE,
          textColor:
            props.data[i].style?.textColor ||
            props.textColors?.[i % props.textColors?.length] ||
            DEFAULT_TEXT_COLORS[0],
        },
      };
      auxPrizeMap.push([]);
      for (let j = 0; j < (wheelDataAux[i].optionSize || 1); j++) {
        auxPrizeMap[i][j] = initialMapNum++;
      }
      if (props.data[i].image) { // Updated to use props.data[i]
        totalImages.value += 1

        const img = new Image();
        img.src = props.data[i].image?.uri || '';
        img.onload = () => {
          img.height = 200 * (props.data[i].image?.sizeMultiplier || 1);
          img.width = (img.naturalWidth / img.naturalHeight) * img.height;
          wheelDataAux[i].image = {
            uri: props.data[i].image?.uri || '',
            offsetX: props.data[i].image?.offsetX || 0,
            offsetY: props.data[i].image?.offsetY || 0,
            landscape: props.data[i].image?.landscape || false,
            sizeMultiplier: props.data[i].image?.sizeMultiplier || 1,
            _imageHTML: img,
          };
          loadedImagesCounter.value += 1
          rouletteUpdater.value = !rouletteUpdater.value
        };
      }
    }

    if (fontsToFetch?.length > 0) {
      try {
        WebFont.load({
          google: {
            families: Array.from(new Set(fontsToFetch.filter((font) => !!font))),
          },
          timeout: 1000,
          fontactive() {
            rouletteUpdater.value = !rouletteUpdater.value
          },
          active() {
            isFontLoaded.value = true
            rouletteUpdater.value = !rouletteUpdater.value
          },
        });
      } catch (err) {
        console.log('Error loading webfonts:', err);
      }
    } else {
      isFontLoaded.value = true
    }

    wheelData.value = [...wheelDataAux]
    prizeMap.value = auxPrizeMap
    setStartingOption(props.startingOptionIndex!, auxPrizeMap);
    isDataUpdated.value = true
  })

  const setStartingOption = (optionIndex: number, optionMap: number[][]) => {
    if (props.startingOptionIndex && props.startingOptionIndex >= 0) {
      const idx = Math.floor(optionIndex) % optionMap?.length;
      const startingOption =
        optionMap[idx][Math.floor(optionMap[idx]?.length / 2)];
      startRotationDegrees.value = getRotationDegrees(startingOption, getQuantity(optionMap), false)
    }
  };

  const getRouletteClass = () => {
    if (hasStartedSpinning) {
      return STARTED_SPINNING;
    }
    return '';
  };

</script>