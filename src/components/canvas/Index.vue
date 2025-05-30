<template>
  <canvas ref="canvasRef" style="width: 100%; height: 100%;" :width="width" :height="height"></canvas>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { clamp, getQuantity } from '../../utils'
  import type { DrawWheelProps, WheelCanvasProps, WheelData } from '../../../types';

  const props = defineProps<WheelCanvasProps>()

  const canvasRef = ref<HTMLCanvasElement | null>(null)

  const drawRadialBorder = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    insideRadius: number,
    outsideRadius: number,
    angle: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(
      centerX + (insideRadius + 1) * Math.cos(angle),
      centerY + (insideRadius + 1) * Math.sin(angle)
    );
    ctx.lineTo(
      centerX + (outsideRadius - 1) * Math.cos(angle),
      centerY + (outsideRadius - 1) * Math.sin(angle)
    );
    ctx.closePath();
    ctx.stroke();
  }

  const drawWheel = (data: WheelData[], drawWheelProps: DrawWheelProps) => {
    let {
      outerBorderColor,
      outerBorderWidth,
      innerRadius,
      innerBorderColor,
      innerBorderWidth,
      radiusLineColor,
      radiusLineWidth,
      fontFamily,
      fontWeight,
      fontSize,
      fontStyle,
      perpendicularText,
      prizeMap,
      textDistance,
    } = drawWheelProps

    const QUANTITY = getQuantity(prizeMap)
    outerBorderWidth *= 2;
    innerBorderWidth *= 2;
    radiusLineWidth *= 2;

    const canvas = canvasRef.value
    if (canvas?.getContext('2d')) {
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      ctx.clearRect(0, 0, 500, 500);
      ctx.strokeStyle = 'transparent';
      ctx.lineWidth = 0;

      let startAngle = 0;
      const outsideRadius = canvas.width / 2 - 10;

      const clampedContentDistance = clamp(0, 100, textDistance);
      const contentRadius = (outsideRadius * clampedContentDistance) / 100;

      const clampedInsideRadius = clamp(0, 100, innerRadius);
      const insideRadius = (outsideRadius * clampedInsideRadius) / 100;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      for (let i = 0; i < data.length; i++) {
        const { optionSize, style } = data[i];

        const arc =
          (optionSize && (optionSize * (2 * Math.PI)) / QUANTITY) ||
          (2 * Math.PI) / QUANTITY;
        const endAngle = startAngle + arc;

        ctx.fillStyle = (style && style.backgroundColor) as string;

        ctx.beginPath();
        ctx.arc(centerX, centerY, outsideRadius, startAngle, endAngle, false);
        ctx.arc(centerX, centerY, insideRadius, endAngle, startAngle, true);
        ctx.stroke();
        ctx.fill();
        ctx.save();

        // WHEEL RADIUS LINES
        ctx.strokeStyle = radiusLineWidth <= 0 ? 'transparent' : radiusLineColor;
        ctx.lineWidth = radiusLineWidth;
        drawRadialBorder(
          ctx,
          centerX,
          centerY,
          insideRadius,
          outsideRadius,
          startAngle
        );
        if (i === data.length - 1) {
          drawRadialBorder(
            ctx,
            centerX,
            centerY,
            insideRadius,
            outsideRadius,
            endAngle
          );
        }

        // WHEEL OUTER BORDER
        ctx.strokeStyle =
          outerBorderWidth <= 0 ? 'transparent' : outerBorderColor;
        ctx.lineWidth = outerBorderWidth;
        ctx.beginPath();
        ctx.arc(
          centerX,
          centerY,
          outsideRadius - ctx.lineWidth / 2,
          0,
          2 * Math.PI
        );
        ctx.closePath();
        ctx.stroke();

        // WHEEL INNER BORDER
        ctx.strokeStyle =
          innerBorderWidth <= 0 ? 'transparent' : innerBorderColor;
        ctx.lineWidth = innerBorderWidth;
        ctx.beginPath();
        ctx.arc(
          centerX,
          centerY,
          insideRadius + ctx.lineWidth / 2 - 1,
          0,
          2 * Math.PI
        );
        ctx.closePath();
        ctx.stroke();

        // CONTENT FILL
        ctx.translate(
          centerX + Math.cos(startAngle + arc / 2) * contentRadius,
          centerY + Math.sin(startAngle + arc / 2) * contentRadius
        );
        let contentRotationAngle = startAngle + arc / 2;

        if (data[i].image) {
          // CASE IMAGE
          contentRotationAngle +=
            data[i].image && !data[i].image?.landscape ? Math.PI / 2 : 0;
          ctx.rotate(contentRotationAngle);

          const img = data[i].image?._imageHTML || new Image();
          ctx.drawImage(
            img,
            (img.width + (data[i].image?.offsetX || 0)) / -2,
            -(
              img.height -
              (data[i].image?.landscape ? 0 : 90) + // offsetY correction for non landscape images
              (data[i].image?.offsetY || 0)
            ) / 2,
            img.width,
            img.height
          );
        } else {
          // CASE TEXT
          contentRotationAngle += perpendicularText ? Math.PI / 2 : 0;
          ctx.rotate(contentRotationAngle);

          const text = data[i].option;
          ctx.font = `${style?.fontStyle || fontStyle} ${style?.fontWeight || fontWeight
            } ${(style?.fontSize || fontSize) * 2}px ${style?.fontFamily || fontFamily
            }, sans-serif, Helvetica, Arial`;
          ctx.fillStyle = (style && style.textColor) as string;
          ctx.fillText(
            text || '',
            -ctx.measureText(text || '').width / 2,
            fontSize / 2.7
          );
        }

        ctx.restore();

        startAngle = endAngle;
      }
    }

  }

  onMounted(() => {
    drawWheel(props.data, {
      outerBorderColor: props.outerBorderColor,
      outerBorderWidth: props.outerBorderWidth,
      innerRadius: props.innerRadius,
      innerBorderColor: props.innerBorderColor,
      innerBorderWidth: props.innerBorderWidth,
      radiusLineColor: props.radiusLineColor,
      radiusLineWidth: props.radiusLineWidth,
      fontFamily: props.fontFamily,
      fontWeight: props.fontWeight,
      fontSize: props.fontSize,
      fontStyle: props.fontStyle,
      perpendicularText: props.perpendicularText,
      prizeMap: props.prizeMap,
      textDistance: props.textDistance,
      rouletteUpdater: props.rouletteUpdater,
    })
  })
</script>