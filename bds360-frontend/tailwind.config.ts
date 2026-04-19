// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '20%': { transform: 'rotate(15deg)' },
          '40%': { transform: 'rotate(-15deg)' },
          '60%': { transform: 'rotate(10deg)' },
          '80%': { transform: 'rotate(-10deg)' },
        },
        // 👇 HIỆU ỨNG NẢY TỪNG CHỮ
        'wave-text': {
          '0%, 100%': { transform: 'translateY(0)' },
          '30%': { transform: 'translateY(-4px)' }, // Nảy lên 4px
        }
      },
      animation: {
        shake: 'shake 0.5s ease-in-out',
        // 👇 Chạy đúng 1 lần (forwards) trong 0.5 giây cho mỗi chữ
        'wave-text': 'wave-text 0.5s ease-in-out forwards',
      }
    },
  },
  plugins: [],
};

export default config;