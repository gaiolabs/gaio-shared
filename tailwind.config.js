/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}', './**/*.{ts, vue}'],
    theme: {
        extend: {
            rounded: {
                DEFAULT: '0.5rem'
            },
            borderRadius: {
                DEFAULT: '0.35rem'
            },
            screens: {
                xm: '440px'
            },
            colors: {
                paper: {
                    100: '#ffffff',
                    200: '#f9f9f8',
                    300: '#f2f2f3',
                    400: '#ececed',
                    500: '#e6e5e6',
                    600: '#e0dfdf',
                    700: '#d9d8d8',
                    800: '#d3d2d2',
                    900: '#cccaca',
                    invert: '#191919'
                },
                carbon: {
                    100: '#141414',
                    200: '#191919',
                    300: '#1D1D1D',
                    400: '#262727',
                    500: '#303030',
                    600: '#39393A',
                    700: '#424243',
                    800: '#414243',
                    900: '#4C4D4F',
                    invert: '#E5EAF3'
                },
                prime: {
                    DEFAULT: 'var(--prime)',
                    hover: 'var(--prime-hover)',
                    pressed: 'var(--prime-pressed)',
                    additional: 'var(--prime-additional)'
                },
                'elevation-0': 'var(--elevation-0)',
                'elevation-1': 'var(--elevation-1)',
                'elevation-2': 'var(--elevation-2)',
                'elevation-3': 'var(--elevation-3)',
                'elevation-4': 'var(--elevation-4)',
                'elevation-invert': 'var(--elevation-invert)'
            }
        }
    },
    plugins: []
}
