const defaultConfig = require("tailwindcss/defaultConfig");

module.exports = {
	theme: {
		extend: {
			inset: {
				full: "100%",
			},
			colors: {
				black: "#1e212b",

				// Tailwind overrides
				"gray-100": "#f7fafb",
				"gray-200": "#eef3f5",
				"gray-300": "#dbdee5",
				"gray-400": "#c4c8cf",
				"gray-500": "#a5adb9",
				"gray-600": "#7e8a9c",
				"gray-700": "#637282",
				"gray-800": "#3c4249",
				"gray-900": "#212225",

				red: "#e51317", // ARK logo
				"red-100": "#ffe0da",
				"red-200": "#feb8ae",
				"red-300": "#ef7c6d",
				"red-400": "#de5846",
				"red-500": "#c9292c",
				"red-600": "#b01e20",
				"red-700": "#881a1b",
				"red-800": "#5b1b1b",
				"red-900": "#391919",

				"blue-100": "#e5f0f8",
				"blue-200": "#bad6f0",
				"blue-300": "#99c7ee",
				"blue-400": "#77b9f3",
				"blue-500": "#3e9dff",
				"blue-600": "#007dff",
				"blue-700": "#075af2",
				"blue-800": "#0b4dc7",
				"blue-900": "#173e85",

				"yellow-100": "#ffe6b8",
				"yellow-200": "#ffd486",
				"yellow-300": "#ffc359",
				"yellow-400": "#feb933",
				"yellow-500": "#ffae10",
				"yellow-600": "#fc9f0f",
				"yellow-700": "#f88e0d",
				"yellow-800": "#f27c0b",
				"yellow-900": "#ec5c08",

				"green-100": "#f6fdf8",
				"green-200": "#e2f0e6",
				"green-300": "#b0dbbc",
				"green-400": "#8cc69d",
				"green-500": "#42b263",
				"green-600": "#289548",
				"green-700": "#307845",
				"green-800": "#2b4f35",
				"green-900": "#26372b",
			},
			minWidth: {
				"200px": "200px",
				"1": "1%",
			},
			maxWidth: {
				"1/4": "25%",
				"8xl": "85rem",
			},
			maxHeight: {
				"17e": "4.25em",
				"18e": "4.5em",
				"128": "32rem",
			},
			height: {
				"1/2": "50%",
				"1/4": "25%",
				"1/3": "33.333333%",
			},
			width: {
				"128": "32rem",
				"144": "36rem",
			},
			padding: {
				10: "2.5rem",
				15: "3.75rem",
				18: "4.5rem",
			},
			margin: {
				"-14": "-3.5rem",
			},
			fontSize: {
				"8xl": "6rem",
			},
			borderWidth: {
				3: "3px",
				10: "10px",
			},
			borderRadius: {
				xl: "1rem",
			},
			boxShadow: {
				"button-primary": "2px 3px 10px 2px rgba(9, 100, 228, 0.34)",
				"button-secondary": "2px 3px 10px 2px rgba(9, 100, 228, 0.34)",
				"header-smooth": " 0px 2px 10px 0px rgba(192, 200, 207, 0.22)",
			},
			fontFamily: {
				sans: ["Inter", ...defaultConfig.theme.fontFamily.sans],
			},
		},

		customForms: (theme) => ({
			default: {
				select: {
					icon: (iconColor) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -5 16 15">
                    <path fill="${iconColor}" d="M3.9 5.4L.7 1.9C.4 1.6.4 1.1.7.8s.7-.3 1 0l2.8 2.9L7.2.8c.3-.3.7-.3 1 0s.3.8 0 1.1L5 5.4c-.3.3-.7.3-1.1 0h0z"/>
                </svg>`,

					iconColor: theme("colors.gray-700"),

					"&:hover": {
						iconColor: theme("colors.gray-600"),
					},
				},
			},
		}),
	},
	variants: {
		borderRadius: [...defaultConfig.variants.borderRadius, "first", "last"],
		borderWidth: [...defaultConfig.variants.borderWidth, "last"],
	},
	plugins: [require("@tailwindcss/ui")],
};
