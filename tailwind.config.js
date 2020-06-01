const defaultConfig = require("tailwindcss/defaultConfig");

module.exports = {
	theme: {
		extend: {
			inset: {
				full: "100%",
				"-1": "-0.25rem",
				"-2": "-0.5rem",
				"-3": "-0.75rem",
				"-4": "-1rem",
				"-5": "-1.25rem",
				"-6": "-1.5rem",
				"-8": "-2rem",
				"-10": "-2.5rem",
				"-12": "-3rem",
				"-16": "-4rem",
				"-20": "-5rem",
				"-24": "-6rem",
				"-32": "-8rem",
				"-40": -"10rem",
				"-48": "-12rem",
				"-56": "-14rem",
				"-64": "-16rem",
			},
			colors: {
        "theme-page-text": "var(--theme-page-text)",
        "theme-page-text-light": "var(--theme-page-text-light)",
        "theme-line-separator": "var(--theme-line-separator)",
        "theme-switch-button": "var(--theme-switch-button)",
        "theme-switch-button-circle": "var(--theme-switch-button-circle)",

				black: "#1e212b",

				gray: {
					"100": "#f7fafb",
					"200": "#eef3f5",
					"300": "#dbdee5",
					"400": "#c4c8cf",
					"500": "#a5adb9",
					"600": "#7e8a9c",
					"700": "#637282",
					"800": "#3c4249",
					"900": "#212225",
				},

				red: {
					logo: "#e51317", // ARK logo
					"100": "#ffe0da",
					"200": "#feb8ae",
					"300": "#ef7c6d",
					"400": "#de5846",
					"500": "#c9292c",
					"600": "#b01e20",
					"700": "#881a1b",
					"800": "#5b1b1b",
					"900": "#391919",
				},

				blue: {
					"100": "#e5f0f8",
					"200": "#bad6f0",
					"300": "#99c7ee",
					"400": "#77b9f3",
					"500": "#3e9dff",
					"600": "#007dff",
					"700": "#075af2",
					"800": "#0b4dc7",
					"900": "#173e85",
				},

				yellow: {
					"100": "#ffe6b8",
					"200": "#ffd486",
					"300": "#ffc359",
					"400": "#feb933",
					"500": "#ffae10",
					"600": "#fc9f0f",
					"700": "#f88e0d",
					"800": "#f27c0b",
					"900": "#ec5c08",
				},

				green: {
					"100": "#f6fdf8",
					"200": "#e2f0e6",
					"300": "#b0dbbc",
					"400": "#8cc69d",
					"500": "#42b263",
					"600": "#289548",
					"700": "#307845",
					"800": "#2b4f35",
					"900": "#26372b",
				},
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
