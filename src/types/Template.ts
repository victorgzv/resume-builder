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
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
    headerStyle?: "default" | "centered" | "leftAligned" | "rightAligned";
  };
}
