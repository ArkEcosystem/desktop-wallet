const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
	purge: false,
	darkMode: "media",
	theme: {
		screens: {
			sm: "640px",
			md: "768px",
			lg: "1024px",
			xl: "1280px",
		},
		colors: {
			black: "#121213",
			"black-rgba": "rgba(18,18,19, var(--tw-bg-opacity))",
			white: "#fff",
			logo: "#c9292c",
			transparent: "transparent",
			current: "currentColor",

			"theme-background": "var(--theme-background-color)",
			"theme-secondary-background": "var(--theme-secondary-background-color)",

			"theme-text": "var(--theme-text-color)",
			"theme-secondary-text": "var(--theme-secondary-text-color)",

			"theme-primary-50": "var(--theme-color-primary-50)",
			"theme-primary-100": "var(--theme-color-primary-100)",
			"theme-primary-200": "var(--theme-color-primary-200)",
			"theme-primary-300": "var(--theme-color-primary-300)",
			"theme-primary-400": "var(--theme-color-primary-400)",
			"theme-primary-500": "var(--theme-color-primary-500)",
			"theme-primary-600": "var(--theme-color-primary-600)",
			"theme-primary-700": "var(--theme-color-primary-700)",
			"theme-primary-800": "var(--theme-color-primary-800)",
			"theme-primary-900": "var(--theme-color-primary-900)",

			"theme-secondary-50": "var(--theme-color-secondary-50)",
			"theme-secondary-100": "var(--theme-color-secondary-100)",
			"theme-secondary-200": "var(--theme-color-secondary-200)",
			"theme-secondary-300": "var(--theme-color-secondary-300)",
			"theme-secondary-400": "var(--theme-color-secondary-400)",
			"theme-secondary-500": "var(--theme-color-secondary-500)",
			"theme-secondary-600": "var(--theme-color-secondary-600)",
			"theme-secondary-700": "var(--theme-color-secondary-700)",
			"theme-secondary-800": "var(--theme-color-secondary-800)",
			"theme-secondary-900": "var(--theme-color-secondary-900)",
			"theme-secondary-900-rgba": "rgba(var(--theme-color-secondary-900-rgb), var(--tw-bg-opacity))",

			"theme-success-50": "var(--theme-color-success-50)",
			"theme-success-100": "var(--theme-color-success-100)",
			"theme-success-200": "var(--theme-color-success-200)",
			"theme-success-300": "var(--theme-color-success-300)",
			"theme-success-400": "var(--theme-color-success-400)",
			"theme-success-500": "var(--theme-color-success-500)",
			"theme-success-600": "var(--theme-color-success-600)",
			"theme-success-700": "var(--theme-color-success-700)",
			"theme-success-800": "var(--theme-color-success-800)",
			"theme-success-900": "var(--theme-color-success-900)",

			"theme-warning-50": "var(--theme-color-warning-50)",
			"theme-warning-100": "var(--theme-color-warning-100)",
			"theme-warning-200": "var(--theme-color-warning-200)",
			"theme-warning-300": "var(--theme-color-warning-300)",
			"theme-warning-400": "var(--theme-color-warning-400)",
			"theme-warning-500": "var(--theme-color-warning-500)",
			"theme-warning-600": "var(--theme-color-warning-600)",
			"theme-warning-700": "var(--theme-color-warning-700)",
			"theme-warning-800": "var(--theme-color-warning-800)",
			"theme-warning-900": "var(--theme-color-warning-900)",

			"theme-danger-50": "var(--theme-color-danger-50)",
			"theme-danger-100": "var(--theme-color-danger-100)",
			"theme-danger-200": "var(--theme-color-danger-200)",
			"theme-danger-300": "var(--theme-color-danger-300)",
			"theme-danger-400": "var(--theme-color-danger-400)",
			"theme-danger-500": "var(--theme-color-danger-500)",
			"theme-danger-600": "var(--theme-color-danger-600)",
			"theme-danger-700": "var(--theme-color-danger-700)",
			"theme-danger-800": "var(--theme-color-danger-800)",
			"theme-danger-900": "var(--theme-color-danger-900)",

			"theme-hint-50": "var(--theme-color-hint-50)",
			"theme-hint-100": "var(--theme-color-hint-100)",
			"theme-hint-200": "var(--theme-color-hint-200)",
			"theme-hint-300": "var(--theme-color-hint-300)",
			"theme-hint-400": "var(--theme-color-hint-400)",
			"theme-hint-500": "var(--theme-color-hint-500)",
			"theme-hint-600": "var(--theme-color-hint-600)",
			"theme-hint-700": "var(--theme-color-hint-700)",
			"theme-hint-800": "var(--theme-color-hint-800)",
			"theme-hint-900": "var(--theme-color-hint-900)",
		},
		extend: {
			opacity: {
				10: "0.1",
				15: "0.15",
				50: "0.50",
				85: "0.85",
				90: "0.9",
			},
			inset: {
				full: "100%",
				"1/2": "50%",
				21: "5.25rem",
				26: "6.5rem",
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
			minWidth: {
				"200px": "200px",
				1: "1%",
				32: "8rem",
			},
			maxWidth: {
				"1/4": "25%",
				"8xl": "85rem",
				32: "8rem",
				72: "18rem",
				128: "32rem",
			},
			maxHeight: {
				"17e": "4.25em",
				"18e": "4.5em",
				128: "32rem",
			},
			height: {
				"1/2": "50%",
				"1/4": "25%",
				"1/3": "33.333333%",
				15: "3.75rem",
				18: "4.5rem",
				21: "5.25rem",
				22: "5.5rem",
				25: "6.25rem",
			},
			width: {
				15: "3.75rem",
				22: "5.5rem",
				25: "6.25rem",
				50: "12.5rem",
				128: "32rem",
				144: "36rem",
				125: "31.25rem",
			},
			padding: {
				"1/2": "50%",
				4.5: "1.125rem",
				10: "2.5rem",
				15: "3.75rem",
				18: "4.5rem",
				25: "6.25rem",
				30: "7.5rem",
			},
			margin: {
				"-14": "-3.5rem",
				"-4.5": "-1.125rem",
				4.5: "1.125rem",
				18: "4.5rem",
				25: "6.25rem",
				27: "6.75rem",
			},
			gap: {
				4.5: "1.125rem",
			},
			fontSize: {
				0: "0",
				"8xl": "6rem",
			},
			borderWidth: {
				3: "3px",
				10: "10px",
				20: "20px",
			},
			borderRadius: {
				"2.5xl": "1.25rem",
			},
			fontFamily: {
				sans: ["Inter", ...defaultTheme.fontFamily.sans],
			},
			borderColor: (theme) => ({
				default: theme("colors.theme-secondary-400"),
			}),
			boxShadow: {
				xs: `0 0 0 1px rgba(var(--theme-shadow-color), var(--theme-shadow-opacity-xs))`,
				sm: `0 1px 2px 0 rgba(var(--theme-shadow-color), var(--theme-shadow-opacity-sm))`,
				base: `0 1px 3px 0 rgba(var(--theme-shadow-color), var(--theme-shadow-opacity-base-primary)), 0 1px 2px 0 rgba(var(--theme-shadow-color), var(--theme-shadow-opacity-base-secondary))`,
				md: `0 4px 6px -1px rgba(var(--theme-shadow-color), var(--theme-shadow-opacity-md-primary)), 0 2px 4px -1px rgba(var(--theme-shadow-color), var(--theme-shadow-opacity-md-secondary))`,
				lg: `0 10px 15px -3px rgba(var(--theme-shadow-color), var(--theme-shadow-opacity-lg-primary)), 0 4px 6px -2px rgba(var(--theme-shadow-color), var(--theme-shadow-opacity-lg-secondary))`,
				xl: `0 20px 25px -5px rgba(var(--theme-shadow-color), var(--theme-shadow-opacity-xl-primary)), 0 10px 10px -5px rgba(var(--theme-shadow-color), var(--theme-shadow-opacity-xl-secondary))`,
				"2xl": `0 25px 50px -12px rgba(var(--theme-shadow-color), var(--theme-shadow-opacity-2xl))`,
				inner: `inset 0 2px 4px 0 rgba(var(--theme-shadow-color), var(--theme-shadow-opacity-inner))`,
				outline: "0 0 0 3px rgba(var(--theme-color-primary-rgb), 0.4)",
				"header-smooth": "0px 2px 10px 0px rgba(192, 200, 207, 0.22)",
				"header-smooth-dark": "0px 2px 10px 0px rgba(18, 18, 19, .6)",
				"votes-filter": "0 15px 35px 0 rgba(var(--theme-color-secondary-900-rgb), 0.1)",
				"footer-smooth": "0px -2px 10px 0px rgba(192, 200, 207, 0.22)",
				"footer-smooth-dark": "0px -2px 10px 0px rgba(18, 18, 19, .6)",
			},
			listStyleType: {
				circle: "circle",
			},
			transitionProperty: {
				background: "background-color",
			},
			ringWidth: {
				6: "6px",
			},
		},
	},
	variants: {
		extend: {
			borderRadius: ["first", "last"],
			borderWidth: ["hover", "group-hover", "first", "last", "even"],
			backgroundOpacity: ["dark"],
			borderStyle: ["focus-within"],
			margin: ["first"],
			opacity: ["group-hover"],
			padding: ["first", "last"],
			ringColor: ["dark", "group-hover"],
			ringWidth: ["group-focus"],
			visibility: ["group-hover"],
		},
	},
	plugins: [require("@tailwindcss/forms")],
};
