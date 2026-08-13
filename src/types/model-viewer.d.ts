import type React from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          "auto-rotate"?: boolean;
          "auto-rotate-delay"?: number | string;
          "rotation-per-second"?: string;
          "camera-controls"?: boolean;
          "disable-zoom"?: boolean;
          "disable-pan"?: boolean;
          "shadow-intensity"?: number | string;
          exposure?: number | string;
          "interaction-prompt"?: string;
          "camera-orbit"?: string;
          poster?: string;
          loading?: string;
          ref?: React.Ref<HTMLElement>;
        },
        HTMLElement
      >;
    }
  }
}
