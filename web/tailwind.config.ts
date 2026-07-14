import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        charcoal: '#14110F',
        surface: '#1E1A16',
        surface2: '#262019',
        hairline: '#3A332B',
        cream: '#F2ECE4',
        copper: '#C77D4B',
        copperDim: '#8F5A38',
        sage: '#6B7A5E',
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      letterSpacing: {
        widest2: '0.25em',
      },
    },
  },
  plugins: [],
};

export default config;
