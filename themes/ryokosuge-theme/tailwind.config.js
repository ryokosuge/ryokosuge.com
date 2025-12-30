/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './layouts/**/*.html',
    './content/**/*.{md,html}',
    '../../layouts/**/*.html',
    '../../content/**/*.{md,html}'
  ],
  safelist: [
    'bg-blue-500',
    'bg-blue-600',
    'bg-green-500',
    'bg-green-600',
    'bg-purple-500',
    'bg-purple-600',
    'bg-orange-500',
    'bg-orange-600',
    'bg-violet-500',
    'bg-violet-600',
    'bg-emerald-500',
    'bg-emerald-600',
    'bg-amber-500',
    'bg-amber-600',
    'bg-cyan-500',
    'bg-cyan-600',
    'dark:bg-blue-600',
    'dark:bg-green-600',
    'dark:bg-purple-600',
    'dark:bg-orange-600',
    'dark:bg-violet-400',
    'dark:bg-emerald-400',
    'dark:bg-amber-400',
    'dark:bg-cyan-400'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Noto Sans JP"',
          '"Hiragino Kaku Gothic ProN"',
          '"Hiragino Sans"',
          '"Yu Gothic"',
          '"YuGothic"',
          '"Meiryo"',
          '"MS Gothic"',
          'sans-serif'
        ]
      },
      colors: {
        primary: {
          DEFAULT: '#06b6d4',
          light: '#0891b2',
          dark: '#22d3ee',
          glow: 'rgba(6, 182, 212, 0.2)'
        }
      },
      fontFamily: {
        mono: [
          'ui-monospace',
          '"SF Mono"',
          'Monaco',
          '"Cascadia Code"',
          '"Roboto Mono"',
          '"Courier New"',
          'monospace'
        ]
      },
      boxShadow: {
        'glow': '0 0 20px rgba(6, 182, 212, 0.2)',
        'glow-lg': '0 0 30px rgba(6, 182, 212, 0.3)'
      },
      lineHeight: {
        'japanese': '1.85',
        'japanese-relaxed': '2.0'
      },
      letterSpacing: {
        'japanese': '0.05em',
        'japanese-wide': '0.1em'
      }
    }
  }
}
