/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mc: {
          bedrock: '#0b0e14',
          deepslate: '#121722',
          card: '#181e2b',
          stone: '#222938',
          border: '#2e374d',
          redstone: '#ff2a4b',
          redstoneGlow: '#ff4d6d',
          diamond: '#00f0ff',
          diamondDark: '#0284c7',
          emerald: '#10b981',
          emeraldGlow: '#34d399',
          gold: '#fbbf24',
          lapis: '#38bdf8',
          amethyst: '#c084fc',
          netherite: '#2a2436'
        },
        brand: {
          dark: '#0b0e14',
          card: '#121722',
          accent: '#00f0ff',
          cyan: '#00f0ff',
          pink: '#ff2a4b',
          amber: '#fbbf24'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        minecraft: ['Silkscreen', 'monospace'],
        mono: ['Fira Code', 'monospace'],
        avengers: ['"Avengeance"', '"Bebas Neue"', '"Orbitron"', 'sans-serif'],
        avengeance: ['"Avengeance"', '"Bebas Neue"', '"Orbitron"', 'sans-serif'],
        bebas: ['"Bebas Neue"', '"Orbitron"', 'sans-serif'],
        doomsday: ['"Avengeance"', '"Bebas Neue"', '"Orbitron"', 'sans-serif'],
        doomzday: ['"Bebas Neue"', '"Orbitron"', 'sans-serif'],
        syncopate: ['"Syncopate"', '"Orbitron"', 'sans-serif'],
        orbitron: ['"Orbitron"', 'sans-serif'],
        chakra: ['"Chakra Petch"', 'sans-serif'],
        space: ['"Space Grotesk"', 'sans-serif'],
      },
      boxShadow: {
        'voxel-sm': 'inset 1px 1px 0px rgba(255,255,255,0.25), inset -1px -1px 0px rgba(0,0,0,0.6), 0 3px 0 #000',
        'voxel-btn': 'inset 2px 2px 0px rgba(255,255,255,0.35), inset -2px -2px 0px rgba(0,0,0,0.6), 0 4px 0 #000',
        'voxel-card': 'inset 1px 1px 0px rgba(255,255,255,0.15), inset -1px -1px 0px rgba(0,0,0,0.7), 0 8px 0 rgba(0,0,0,0.5)',
        'diamond-glow': '0 0 25px rgba(0, 240, 255, 0.4), inset 0 0 15px rgba(0, 240, 255, 0.2)',
        'redstone-glow': '0 0 25px rgba(255, 42, 75, 0.45), inset 0 0 15px rgba(255, 42, 75, 0.2)',
        'emerald-glow': '0 0 25px rgba(16, 185, 129, 0.4), inset 0 0 15px rgba(16, 185, 129, 0.2)'
      },
      animation: {
        'pulse-redstone': 'redstonePulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'floatVoxel 6s ease-in-out infinite',
      },
      keyframes: {
        redstonePulse: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 10px #ff2a4b)' },
          '50%': { opacity: '0.4', filter: 'drop-shadow(0 0 2px #ff2a4b)' }
        },
        floatVoxel: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(2deg)' }
        }
      }
    },
  },
  plugins: [],
}
