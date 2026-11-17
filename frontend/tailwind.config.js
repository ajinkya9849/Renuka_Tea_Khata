/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cafe: {
          primary: '#5B2D16',       // Primary Coffee Brown
          espresso: '#321707',      // Dark Espresso
          caramel: '#C45A0A',       // Caramel Orange
          cream: '#FFF6EC',         // Warm Cream Background
          beige: '#FBEBDD',         // Soft Beige Cards
          peach: '#FFE7CC',         // Light Peach
          darkText: '#181818',      // Primary Text
          mutedText: '#6B7280',     // Secondary Text
          success: '#16803C',       // Green Success
          danger: '#DC2626',        // Red Outstanding
          cardBorder: '#F3DEC9',    // Subtle warm border
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'cafe-sm': '0 2px 8px -1px rgba(91, 45, 22, 0.06)',
        'cafe-md': '0 4px 16px -2px rgba(91, 45, 22, 0.08), 0 2px 6px -1px rgba(91, 45, 22, 0.04)',
        'cafe-lg': '0 10px 25px -3px rgba(91, 45, 22, 0.12), 0 4px 10px -2px rgba(91, 45, 22, 0.06)',
        'cafe-inner': 'inset 0 2px 4px 0 rgba(91, 45, 22, 0.05)',
      },
      borderRadius: {
        'ios': '1.25rem',
        'ios-lg': '1.5rem',
        'ios-xl': '2rem',
      }
    },
  },
  plugins: [],
}
