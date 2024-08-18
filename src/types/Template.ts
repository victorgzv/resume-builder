export interface Template {
  id: string;
  name: string;
  description?: string;
  fontFamily: string;
  fontSize: string;
  color: string;
  watermark?: string;
  watermarkOpacity?: number;
  layout?: {
    showDividers: boolean;
    margins?: {
      x: number;
      y: number;
    };
    headerStyle?: "default" | "centered" | "leftAligned" | "rightAligned";
  };
}
