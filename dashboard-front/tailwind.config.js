module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/react-leaflet/**/*.{js,jsx,ts,tsx}' // أضف هذا لدمج أنماط Leaflet
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6',
          dark: '#2563eb'
        },
        indigo: {
          600: '#4f46e5',
          500: '#6366f1',
        },
        gray: {
          800: '#1f2937',
          900: '#111827',
          700: '#374151',
        },
        // ألوان إضافية للخريطة
        map: {
          allowed: '#10b981',  // أخضر للمناطق المسموحة
          forbidden: '#ef4444' // أحمر للمناطق الممنوعة
        }
      },
      // إضافة أحجام مخصصة لحاوية الخريطة
      height: {
        'map-sm': '20rem',
        'map-md': '30rem',
        'map-lg': '40rem'
      }
    },
  },
  plugins: [],
}