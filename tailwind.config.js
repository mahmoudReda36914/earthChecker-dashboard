/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    container: { center: true, padding: '1.5rem' },
    extend: {
      // ── Colors (exact parity with landing index.css variables) ──
      colors: {
        bg: {
          primary:   '#060810',
          secondary: '#0a0d15',
          card:      'rgba(255,255,255,0.03)',
          glass:     'rgba(8,12,20,0.72)',
        },
        // Primary accent — cyan
        cyan: {
          DEFAULT: '#00d4ff',
          dim:     'rgba(0,212,255,0.12)',
          glow:    'rgba(0,212,255,0.45)',
          border:  'rgba(0,212,255,0.20)',
          muted:   'rgba(0,212,255,0.08)',
          dark:    '#007acc',
          '500':   '#00d4ff',
          '600':   '#00b8e6',
          '700':   '#007acc',
        },
        // Secondary accent — copper
        copper: {
          DEFAULT: '#c87941',
          dim:     'rgba(200,121,65,0.15)',
          glow:    'rgba(200,121,65,0.40)',
          border:  'rgba(200,121,65,0.20)',
          light:   '#d98e55',
          dark:    '#9a5a28',
        },
        // Steel / neutral
        steel: {
          DEFAULT: '#8fa3b8',
          dim:     'rgba(143,163,184,0.12)',
          border:  'rgba(143,163,184,0.12)',
          muted:   '#3d4f63',
        },
        // Text system
        text: {
          primary:   '#eef2f7',
          secondary: '#8fa3b8',
          muted:     '#3d4f63',
        },
      },

      // ── Typography (Orbitron + Inter — same as landing) ──
      fontFamily: {
        orbitron: ['Orbitron', 'monospace'],
        inter:    ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        sans:     ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono:     ['Orbitron', 'monospace'],
      },

      // ── Font sizes (landing scale) ──
      fontSize: {
        '2xs': ['0.625rem',  { lineHeight: '1rem', letterSpacing: '0.1em' }],
        xs:    ['0.75rem',   { lineHeight: '1rem' }],
        sm:    ['0.875rem',  { lineHeight: '1.25rem' }],
        base:  ['1rem',      { lineHeight: '1.6rem' }],
        lg:    ['1.125rem',  { lineHeight: '1.75rem' }],
        xl:    ['1.25rem',   { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem',    { lineHeight: '2rem' }],
        '3xl': ['2rem',      { lineHeight: '2.25rem' }],
        '4xl': ['2.5rem',    { lineHeight: '2.75rem' }],
        '5xl': ['3.5rem',    { lineHeight: '1.1' }],
      },

      // ── Border radius (landing uses 8–12px cards, 100px badges) ──
      borderRadius: {
        none:    '0',
        sm:      '4px',
        DEFAULT: '8px',
        md:      '10px',
        lg:      '12px',
        xl:      '16px',
        '2xl':   '20px',
        '3xl':   '24px',
        full:    '9999px',
      },

      // ── Shadows (landing exact values) ──
      boxShadow: {
        'glass':          '0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)',
        'glass-hover':    '0 12px 48px rgba(0,0,0,0.55), 0 0 30px rgba(0,212,255,0.06)',
        'glow-sm':        '0 0 15px rgba(0,212,255,0.25)',
        'glow':           '0 0 30px rgba(0,212,255,0.35), 0 4px 16px rgba(0,0,0,0.4)',
        'glow-lg':        '0 0 60px rgba(0,212,255,0.55), 0 8px 30px rgba(0,0,0,0.5)',
        'glow-copper':    '0 0 25px rgba(200,121,65,0.35)',
        'glow-copper-lg': '0 0 45px rgba(200,121,65,0.55)',
        'card':           '0 4px 24px rgba(0,0,0,0.35)',
      },

      // ── Backdrop blur (landing uses blur-20 on all glass) ──
      backdropBlur: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '20px',
        xl: '32px',
      },

      // ── Background images ──
      backgroundImage: {
        'grid-cyan':      `linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px)`,
        'glow-radial':    'radial-gradient(circle, rgba(0,212,255,0.055) 0%, transparent 65%)',
        'glow-copper-r':  'radial-gradient(circle, rgba(200,121,65,0.04) 0%, transparent 65%)',
        'btn-cyan':       'linear-gradient(135deg, rgba(0,212,255,0.9) 0%, rgba(0,140,200,0.9) 100%)',
        'btn-copper':     'linear-gradient(135deg, #c87941 0%, #9a5a28 100%)',
        'shimmer-cyan':   'linear-gradient(90deg, #00d4ff, #007acc, #00d4ff)',
      },

      // ── Spacing (8px base grid, same as landing) ──
      spacing: {
        sidebar:           '256px',
        'sidebar-sm':      '64px',
        topbar:            '64px',
        'section-pad':     '160px',
        'section-pad-sm':  '80px',
      },

      // ── Animations ──
      animation: {
        'pulse-glow':   'pulseGlow 2s ease-in-out infinite',
        'copper-pulse': 'copperPulse 2s ease-in-out infinite',
        'scan-sweep':   'scanSweep 8s linear infinite',
        'shimmer':      'shimmer 4s linear infinite',
        'fade-in-up':   'fadeInUp 0.5s ease both',
        'fade-in-down': 'fadeInDown 0.4s ease both',
        'slide-in':     'slideIn 0.3s cubic-bezier(0.16,1,0.3,1) both',
        'float':        'float 4s ease-in-out infinite',
        'dot-pulse':    'dotPulse 2s ease-in-out infinite',
        'border-glow':  'borderGlow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
