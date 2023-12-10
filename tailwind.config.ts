import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3A86FF',
        secondary: '#8338EC',
        warning: '#FFBE0B',
        danger: '#FF006E',
        success: '#00DC42',
      },
    },
  },
  plugins: [],
};
export default config;
