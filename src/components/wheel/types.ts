import type { CSSProperties } from "vue";

interface ImagePropsLocal extends ImageProps {
  _imageHTML?: HTMLImageElement;
}

export interface WheelData {
  image?: ImagePropsLocal;
  option?: string;
  style?: StyleType;
  optionSize?: number;
}

export interface StyleType {
  backgroundColor?: string;
  textColor?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number | string;
  fontStyle?: string;
}

export interface ImageProps {
  uri: string;
  offsetX?: number;
  offsetY?: number;
  sizeMultiplier?: number;
  landscape?: boolean;
}

export interface WheelCanvasProps extends DrawWheelProps {
  width: string;
  height: string;
  data: WheelData[];
}

export interface DrawWheelProps {
  outerBorderColor: string;
  outerBorderWidth: number;
  innerRadius: number;
  innerBorderColor: string;
  innerBorderWidth: number;
  radiusLineColor: string;
  radiusLineWidth: number;
  fontFamily: string;
  fontWeight: number | string;
  fontSize: number;
  fontStyle: string;
  perpendicularText: boolean;
  prizeMap: number[][];
  rouletteUpdater: boolean;
  textDistance: number;
}

export interface PointerProps {
  src?: string;
  style?: CSSProperties;
}