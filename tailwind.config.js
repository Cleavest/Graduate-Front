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
                'nav-bg': '#26282B',
                'nav-text': '#FFFFFF',
                'nav-primary': '#5F85DB',
                'nav-secondary': '#90B8F8',
            },
        },
    },
    plugins: [],
};
