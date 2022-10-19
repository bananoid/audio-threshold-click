module.exports = {
	safelist: [],

	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		colors: {
			accent: '#ff1111',
			'accent-content': '#ffffff'
		},
		extend: {}
	},
	plugins: [require('daisyui')],

	daisyui: {
		styled: true,
		themes: ['converso-dark'],
		base: true,
		utils: true,
		logs: true,
		rtl: false,
		prefix: '',
		darkTheme: 'converso-dark',

		themes: [
			{
				'converso-dark': {
					primary: '#2563eb',
					secondary: '#78716c',
					accent: '#f43f5e',
					neutral: '#111827',
					'base-100': '#222222',
					info: '#7dd3fc',
					success: '#38bdf8',
					warning: '#fef08a',
					error: '#fda4af',

					'--rounded-box': '1rem', // border radius rounded-box utility class, used in card and other large boxes
					'--rounded-btn': '0.5rem', // border radius rounded-btn utility class, used in buttons and similar element
					'--rounded-badge': '1.9rem', // border radius rounded-badge utility class, used in badges and similar
					'--animation-btn': '0.0', // duration of animation when you click on button
					'--animation-input': '0.2s', // duration of animation for inputs like checkbox, toggle, radio, etc
					'--btn-text-case': 'uppercase', // set default text transform for buttons
					'--btn-focus-scale': '0.95', // scale transform of button when you focus on it
					'--border-btn': '1px', // border width of buttons
					'--tab-border': '1px', // border width of tabs
					'--tab-radius': '0.5rem' // border radius of tabs
				}
			}
		]
	}
};
