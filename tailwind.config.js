/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 莫蘭迪主色調
        primary: {
          50: '#f5f7fa',
          100: '#eaeff4',
          200: '#d1dce6',
          300: '#a8bdd1',
          400: '#8b9dc3',
          500: '#6b7fa8', // 主色：暖灰藍
          600: '#5a6b8a',
          700: '#4a5670',
          800: '#3d475d',
          900: '#343a4f',
        },
        // 莫蘭迪輔助色
        secondary: {
          50: '#faf9f7',
          100: '#f5f2ee',
          200: '#ebe4da',
          300: '#ddb892', // 淺駝色
          400: '#c9a876',
          500: '#b8975a',
          600: '#a6834c',
          700: '#8b6d3f',
          800: '#725936',
          900: '#5f4a2e',
        },
        // 莫蘭迪背景色
        background: {
          50: '#fefefe',
          100: '#fdfdfc',
          200: '#f8f6f0', // 米白色背景
          300: '#f0ede6',
          400: '#e8e3da',
          500: '#ddd6cc',
          600: '#cdc4b8',
          700: '#b8ab9e',
          800: '#9d8f82',
          900: '#82766a',
        },
        // 強調色（暖橘）
        accent: {
          50: '#fef7f3',
          100: '#fdeee6',
          200: '#fad8c7',
          300: '#f6bda3',
          400: '#f09a7d',
          500: '#ee6c4d', // 暖橘強調色
          600: '#e4522f',
          700: '#c03d21',
          800: '#9f3520',
          900: '#822f20',
        },
        // 莫蘭迪文字色
        text: {
          primary: '#3d5a80', // 深灰藍
          secondary: '#5a6b8a', // 中灰藍
          muted: '#8b9dc3', // 淺灰藍
          light: '#a8bdd1', // 極淺灰藍
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans TC', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 15px 0 rgba(139, 157, 195, 0.08)',
        'soft-lg': '0 4px 25px 0 rgba(139, 157, 195, 0.12)',
        'soft-xl': '0 8px 40px 0 rgba(139, 157, 195, 0.15)',
      },
    },
  },
  plugins: [],
}
