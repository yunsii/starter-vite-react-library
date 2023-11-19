import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}', './docs/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config
