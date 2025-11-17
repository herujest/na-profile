declare module "custom-cursor-react" {
  import { ReactNode } from "react";

  interface CustomCursorProps {
    targets?: string[];
    customClass?: string;
    dimensions?: number;
    fill?: string;
    smoothness?: {
      movement?: number;
      scale?: number;
      opacity?: number;
    };
    targetOpacity?: number;
    targetScale?: number;
  }

  const CustomCursor: React.FC<CustomCursorProps>;
  export default CustomCursor;
}

