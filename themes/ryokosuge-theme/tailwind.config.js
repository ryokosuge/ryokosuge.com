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
    'dark:bg-blue-600',
    'dark:bg-green-600',
    'dark:bg-purple-600',
    'dark:bg-orange-600'
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
          DEFAULT: '#3b82f6',
          dark: '#60a5fa'
        }
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
