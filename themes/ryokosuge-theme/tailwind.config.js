/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './layouts/**/*.html',
    './content/**/*.{md,html}',
    '../../layouts/**/*.html',
    '../../content/**/*.{md,html}'
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
