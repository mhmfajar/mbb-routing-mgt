import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
  presetWind4,
} from "unocss";

export default defineConfig({
  // Presets
  presets: [
    presetWind4(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      cdn: "https://esm.sh/",
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: "Montserrat:400,500,600,700",
      },
    }),
  ],

  // Transformers
  transformers: [transformerDirectives(), transformerVariantGroup()],

  // Theme customization
  theme: {
    colors: {
      primary: {
        DEFAULT: "#646cff",
        hover: "#535bf2",
      },
      background: {
        DEFAULT: "#242424",
        secondary: "#1a1a1a",
      },
      text: {
        DEFAULT: "rgba(255, 255, 255, 0.87)",
        muted: "#888",
      },
      border: "rgba(255, 255, 255, 0.1)",
    },
  },

  // Shortcuts for reusable class combinations
  shortcuts: {
    btn: "inline-flex items-center justify-center gap-2 font-medium rounded-lg cursor-pointer transition-all duration-150 border border-transparent disabled:opacity-60 disabled:cursor-not-allowed",
    "btn-primary": "btn bg-primary text-white hover:bg-primary-hover",
    "btn-secondary":
      "btn bg-background-secondary text-text border-border hover:bg-background",
    "btn-outline":
      "btn bg-transparent text-primary border-primary hover:bg-primary hover:text-white",
    "btn-sm": "px-3 py-1.5 text-sm",
    "btn-md": "px-4 py-2 text-base",
    "btn-lg": "px-6 py-3 text-lg",
    "nav-link":
      "text-text-muted font-medium transition-colors duration-150 hover:text-text relative",
    "nav-link-active": "text-primary font-medium relative",
    container: "max-w-1200px mx-auto w-full",
  },

  // Preflights for custom scrollbar
  preflights: [
    {
      getCSS: () => `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
          -webkit-appearance: none;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #e5e5e5;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #44546a;
          border-radius: 4px;
          min-height: 30px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #374357;
        }
      `,
    },
  ],

  // Safelist classes that should always be included
  safelist: [
    "btn-primary",
    "btn-secondary",
    "btn-outline",
    "btn-sm",
    "btn-md",
    "btn-lg",
  ],
});
