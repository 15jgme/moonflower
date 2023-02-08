/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			backgroundImage: {
				'wave-bg': "url('/svg/layered-waves-haikei.svg')"
			}
		}
	},
	plugins: [require('daisyui')],
	daisyui: {
		themes: ["dracula",
			{
				darker: {
					primary: '#FB923C',
					secondary: '#AA53EA',
					accent: '#FF386A',
					neutral: '#3A3E41',
					'base-100': '#334155',
					info: '#334155',
					success: '#115A4E',
					warning: '#EC9E32',
					error: '#DF3067'
				}
			}
		]
	}
};
