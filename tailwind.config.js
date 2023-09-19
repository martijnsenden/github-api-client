/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		colors: {
			black: 'hsl(0, 0%, 0%)',
			blue: {
				buttons: 'hsl(212, 100%, 41%)',
				'buttons-hover': 'hsl(212, 100%, 31%)',
				heading: 'hsl(218, 100%, 25%)',
				logo: 'hsl(218, 100%, 25%)',
			},
			gray: {
				backgrounds: 'hsl(240, 6%, 91%)',
				borders: 'hsl(240, 5%, 71%)',
				placeholders: 'hsl(240, 5%, 71%)',
				banner: 'hsl(200, 19%, 18%)',
			},
			red: {
				warning: 'hsl(349, 100%, 43%)',
			},
			white: 'hsl(0, 0%, 100%)',
			transparent: 'hsla(0, 0%, 0%, 0)',
			yellow: {
				banners: 'hsl(46, 100%, 55%)',
				borders: 'hsl(46, 81%, 50%)',
			},
		},
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			boxShadow: {
				buttons: 'inset 0 -2.44339px 0 hsl(211.9, 100%, 31.4%)',
				'buttons-hover': 'inset 0 -50px 0 hsl(211.9, 100%, 31.4%)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
};
