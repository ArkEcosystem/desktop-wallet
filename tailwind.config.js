module.exports = {
	purge: {
		enabled: true,
		content: ["./src/**/*.html", "./src/**/*.vue"],
	},

	theme: {
		colors: {
			// Custom color variables
			"default-background": "#f7fafb",
			"theme-page": "var(--theme-page)",
			"theme-page-text": "var(--theme-page-text)",
			"theme-page-text-light": "var(--theme-page-text-light)",
			"theme-page-instructions-text": "var(--theme-page-instructions-text)",
			"theme-page-instructions-background": "var(--theme-page-instructions-background)",
			"theme-modal": "var(--theme-modal)",

			"theme-header-text": "var(--theme-header-text)",

			"theme-intro-gradient-1": "var(--theme-intro-gradient-1)",
			"theme-intro-gradient-2": "var(--theme-intro-gradient-2)",

			"theme-announcements-gradient-1": "var(--theme-announcements-gradient-1)",
			"theme-announcements-gradient-2": "var(--theme-announcements-gradient-2)",

			"theme-line-separator": "var(--theme-line-separator)",
			"theme-wallet-overview-border": "var(--theme-wallet-overview-border)",

			"theme-table-row-hover": "var(--theme-table-row-hover)",
			"theme-transaction-sent": "var(--theme-transaction-sent)",
			"theme-transaction-sent-arrow": "var(--theme-transaction-sent-arrow)",
			"theme-transaction-received": "var(--theme-transaction-received)",
			"theme-transaction-received-arrow": "var(--theme-transaction-received-arrow)",
			"theme-send-circle-second-signature": "var(--theme-send-circle-second-signature)",
			"theme-send-circle-second-signature-text": "var(--theme-send-circle-second-signature-text)",
			"theme-send-circle-register-delegate": "var(--theme-send-circle-register-delegate)",
			"theme-send-circle-register-delegate-text": "var(--theme-send-circle-register-delegate-text)",
			"theme-send-circle-vote": "var(--theme-send-circle-vote)",
			"theme-send-circle-vote-text": "var(--theme-send-circle-vote-text)",
			"theme-transaction-detail-gradient1": "var(--theme-transaction-detail-gradient1)",
			"theme-transaction-detail-gradient2": "var(--theme-transaction-detail-gradient2)",
			"theme-transaction-detail-arrow": "var(--theme-transaction-detail-arrow)",
			"theme-transaction-confirmations-received": "var(--theme-transaction-confirmations-received)",
			"theme-transaction-confirmations-sent": "var(--theme-transaction-confirmations-sent)",

			"theme-wallet-new-selected": "var(--theme-wallet-new-selected)",
			"theme-wallet-new-unselected": "var(--theme-wallet-new-unselected)",
			"theme-wallet-sign-verify-message-text": "var(--theme-wallet-sign-verify-message-text)",

			"theme-feature": "var(--theme-feature)",
			"theme-feature-item-text": "var(--theme-feature-item-text)",
			"theme-feature-item-hover": "var(--theme-feature-item-hover)",
			"theme-feature-item-alternative": "var(--theme-feature-item-alternative)",
			"theme-feature-item-alternative-text": "var(--theme-feature-item-alternative-text)",
			"theme-feature-item-hover-text": "var(--theme-feature-item-hover-text)",
			"theme-feature-item-selected": "var(--theme-feature-item-selected)",
			"theme-feature-item-selected-text": "var(--theme-feature-item-selected-text)",
			"theme-feature-item-indicator": "var(--theme-feature-item-indicator)",

			"theme-secondary-feature": "var(--theme-secondary-feature)",

			"theme-caption-text": "var(--theme-caption-text)",
			"theme-heading-background": "var(--theme-heading-background)",
			"theme-heading-text": "var(--theme-heading-text)",

			"theme-button-special-choice": "var(--theme-button-special-choice)",

			"theme-chart-background": "var(--theme-chart-background)",
			"theme-chart-price": "var(--theme-chart-price)",

			"theme-button": "var(--theme-button)",
			"theme-button-active": "var(--theme-button-active)",
			"theme-button-text": "var(--theme-button-text)",
			"theme-button-light": "var(--theme-button-light)",
			"theme-button-light-text": "var(--theme-button-light-text)",
			"theme-button-inner-box": "var(--theme-button-inner-box)",
			"theme-action-button": "var(--theme-action-button)",
			"theme-action-button-text": "var(--theme-action-button-text)",
			"theme-action-button-text-hover": "var(--theme-action-button-text-hover)",
			"theme-option-button": "var(--theme-option-button)",
			"theme-option-button-hover": "var(--theme-option-button-hover)",
			"theme-option-button-text": "var(--theme-option-button-text)",
			"theme-switch-button": "var(--theme-switch-button)",
			"theme-option-heading-button": "var(--theme-option-heading-button)",
			"theme-option-heading-button-hover": "var(--theme-option-heading-button-hover)",
			"theme-option-heading-button-text": "var(--theme-option-heading-button-text)",
			"theme-input-field-border": "var(--theme-input-field-border)",
			"theme-input-toggle-choice": "var(--theme-input-toggle-choice)",
			"theme-input-toggle-choice-text": "var(--theme-input-toggle-choice-text)",
			"theme-modal-footer-button": "var(--theme-modal-footer-button)",
			"theme-modal-footer-button-text": "var(--theme-modal-footer-button-text)",

			"theme-explanation-background": "var(--theme-explanation-background)",
			"theme-explanation-text": "var(--theme-explanation-text)",

			"theme-voting-banner-background": "var(--theme-voting-banner-background)",
			"theme-voting-banner-text": "var(--theme-voting-banner-text)",
			"theme-voting-banner-button": "var(--theme-voting-banner-button)",
			"theme-voting-banner-button-hover": "var(--theme-voting-banner-button-hover)",
			"theme-voting-banner-button-text": "var(--theme-voting-banner-text)",
			"theme-voting-banner-button-text-hover": "var(--theme-voting-banner-text-hover)",

			"theme-settings": "var(--theme-settings)",
			"theme-settings-sub": "var(--theme-settings-sub)",
			"theme-settings-button": "var(--theme-settings-button)",
			"theme-settings-heading": "var(--theme-settings-heading)",
			"theme-settings-border": "var(--theme-settings-border)",
			"theme-settings-text": "var(--theme-settings-text)",
			"theme-settings-control-title": "var(--theme-settings-control-title)",

			"theme-error": "var(--theme-error)",
			"theme-error-shadow": "var(--theme-error-shadow)",
			"theme-success": "var(--theme-success)",
			"theme-success-shadow": "var(--theme-success-shadow)",
			"theme-info": "var(--theme-info)",
			"theme-info-shadow": "var(--theme-info-shadow)",
			"theme-warn": "var(--theme-warn)",
			"theme-warn-shadow": "var(--theme-warn-shadow)",
			"theme-warn-text": "var(--theme-warn-text)",

			"theme-banner-background-color": "var(--theme-banner-background-color)",
			"theme-banner-text": "var(--theme-banner-text)",

			"theme-footer-text": "#a4acb8",

			transparent: "transparent",
			inherit: "inherit",

			black: "#22292f",
			"grey-darkest": "#3d4852",
			"grey-darker": "#606f7b",
			"grey-dark": "#8795a1",
			grey: "#b8c2cc",
			"grey-light": "#dae1e7",
			"grey-lighter": "#f1f5f8",
			"grey-lightest": "#f8fafc",
			white: "#ffffff",

			"red-darkest": "#3b0d0c",
			"red-darker": "#621b18",
			"red-dark": "#cc1f1a",
			red: "#e51317", // ARK logo
			"red-light": "#f03643", // Sidemenu hover and selected border
			"red-lighter": "#f9acaa",
			"red-lightest": "#fef4f5", // Sidemenu hover background

			"orange-darkest": "#462a16",
			"orange-darker": "#613b1f",
			"orange-dark": "#de751f",
			orange: "#f6993f",
			"orange-light": "#faad63",
			"orange-lighter": "#fcd9b6",
			"orange-lightest": "#fff5eb",

			"yellow-darkest": "#453411",
			"yellow-darker": "#684f1d",
			"yellow-dark": "#f2d024",
			yellow: "#ffed4a",
			"yellow-light": "#fff382",
			"yellow-lighter": "#ffeaa5", // UPDATED
			"yellow-lightest": "#fcfbeb",

			"green-darkest": "#0f2f21",
			"green-darker": "#1a4731",
			"green-dark": "#1f9d55",
			green: "#2db761", // UPDATED
			"green-light": "#51d88a",
			"green-lighter": "#a2f5bf",
			"green-lightest": "#e3fcec",

			"teal-darkest": "#0d3331",
			"teal-darker": "#20504f",
			"teal-dark": "#38a89d",
			teal: "#4dc0b5",
			"teal-light": "#64d5ca",
			"teal-lighter": "#a0f0ed",
			"teal-lightest": "#e8fffe",

			"blue-darkest": "#202126", // UPDATED
			"blue-darker": "#282a38", // UPDATED
			"blue-dark": "#2779bd",
			blue: "#037cff", // UPDATED
			"blue-light": "#6f77a4", // UPDATED
			"blue-lighter": "#c0cddf", // Sidemenu icons
			"blue-lightest": "#edf4f5", // Background

			"indigo-darkest": "#191e38",
			"indigo-darker": "#2f365f",
			"indigo-dark": "#5661b3",
			indigo: "#6574cd",
			"indigo-light": "#7886d7",
			"indigo-lighter": "#b2b7ff",
			"indigo-lightest": "#e6e8ff",

			"purple-darkest": "#21183c",
			"purple-darker": "#382b5f",
			"purple-dark": "#794acf",
			purple: "#9561e2",
			"purple-light": "#a779e9",
			"purple-lighter": "#d6bbfc",
			"purple-lightest": "#f3ebff",

			"pink-darkest": "#451225",
			"pink-darker": "#6f213f",
			"pink-dark": "#eb5286",
			pink: "#f66d9b",
			"pink-light": "#e28188", // Sidemenu active icon
			"pink-lighter": "#e5b0b4", // Sidemenu hover icon
			"pink-lightest": "#ffebef",
		},

		screens: {
			sm: "576px",
			md: "768px",
			"max-md": {
				max: "991px",
			},
			lg: "992px",
			"minmax-lg": {
				min: "992px",
				max: "1199px",
			},
			"min-xl": {
				min: "1200px",
			},
			xl: "1200px",
			xxl: "1375px",
			"min-xxl": {
				min: "1375px",
			},
		},

		fontFamily: {
			sans: [
				"Proxima Nova",
				"system-ui",
				"BlinkMacSystemFont",
				"-apple-system",
				"Segoe UI",
				"Roboto",
				"Oxygen",
				"Ubuntu",
				"Cantarell",
				"Fira Sans",
				"Droid Sans",
				"Helvetica Neue",
				"sans-serif",
			],
			serif: [
				"Constantia",
				"Lucida Bright",
				"Lucidabright",
				"Lucida Serif",
				"Lucida",
				"DejaVu Serif",
				"Bitstream Vera Serif",
				"Liberation Serif",
				"Georgia",
				"serif",
			],
			mono: ["Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"],
		},

		fontSize: {
			xs: ".75rem", // 12px
			sm: ".875rem", // 14px
			base: "1rem", // 16px
			lg: "1.125rem", // 18px
			xl: "1.25rem", // 20px
			"2xl": "1.5rem", // 24px
			"3xl": "1.875rem", // 30px
			"base-xl": "2rem", // 32px Added
			"4xl": "2.25rem", // 36px
			"5xl": "3rem", // 48px
		},

		fontWeight: {
			hairline: 100,
			thin: 200,
			light: 300,
			normal: 400,
			medium: 500,
			semibold: 600,
			bold: 700,
			extrabold: 800,
			black: 900,
		},

		lineHeight: {
			none: 1,
			tight: 1.25,
			normal: 1.5,
			loose: 2,
		},

		letterSpacing: {
			tight: "-0.05em",
			normal: "0",
			semiwide: "0.025em",
			wide: "0.05em",
			extrawide: "0.075em",
		},

		textColor: (theme) => theme("colors"),

		backgroundColor: (theme) => theme("colors"),

		backgroundSize: {
			auto: "auto",
			cover: "cover",
			contain: "contain",
		},

		borderWidth: {
			default: "1px",
			"0": "0",
			"2": "2px",
			"3": "3px", // Added
			"4": "4px",
			"8": "8px",
		},

		borderColor: (theme) => ({
			default: theme("colors.grey-light"),
			...theme("colors"),
		}),

		borderRadius: {
			none: "0",
			sm: ".125rem",
			default: ".25rem",
			lg: ".5rem",
			xl: "1rem",
			full: "9999px",
			"1/2": "100%", // Added
		},

		width: {
			auto: "auto",
			px: "1px",
			"1": "0.25rem",
			"2": "0.5rem",
			"3": "0.75rem",
			"4": "1rem",
			"5": "1.25rem",
			"6": "1.5rem",
			"8": "2rem",
			"10": "2.5rem",
			"12": "3rem",
			"16": "4rem",
			"18": "4.5rem", // Added
			"20": "5.0rem", // Added
			"22": "5.5rem", // Added
			"24": "6rem",
			"30": "7rem", // Added
			"32": "8rem",
			"36": "9rem", // Added
			"48": "12rem",
			"64": "16rem",
			"80": "20rem", // Added
			"88": "22rem", // Added
			md: "40rem", // Added
			"1/2": "50%",
			"1/3": "33.33333%",
			"2/3": "66.66667%",
			"1/4": "25%",
			"3/4": "75%",
			"1/5": "20%",
			"2/5": "40%",
			"3/5": "60%",
			"4/5": "80%",
			"1/6": "16.66667%",
			"1/8": "12.50%", // Added
			"7/8": "87.50%", // Added
			"5/6": "83.33333%",
			full: "100%",
			screen: "100vw",
		},

		height: {
			auto: "auto",
			px: "1px",
			"1": "0.25rem",
			"2": "0.5rem",
			"3": "0.75rem",
			"4": "1rem",
			"5": "1.25rem",
			"6": "1.5rem",
			"8": "2rem",
			"10": "2.5rem",
			"12": "3rem",
			"16": "4rem",
			"18": "4.5rem", // Added
			"20": "5.0rem", // Added
			"24": "6rem",
			"30": "7rem", // Added
			"32": "8rem",
			"40": "10rem", // Added
			"48": "12rem",
			"64": "16rem",
			"100": "25rem", // Added
			"120": "30rem", // Added
			"1/2": "50%", // Added
			full: "100%",
			screen: "100vh",
		},

		minWidth: {
			"0": "0",
			"1/4": "25%", // Added
			"48": "12rem", // Added
			full: "100%",
		},

		minHeight: {
			"0": "0",
			full: "100%",
			screen: "100vh",
		},

		maxWidth: {
			xxs: "10rem",
			xs: "20rem",
			sm: "30rem",
			md: "40rem",
			lg: "50rem",
			xl: "60rem",
			"2xl": "70rem",
			"3xl": "80rem",
			"4xl": "90rem",
			"5xl": "100rem",
			"1/2": "50%", // Added
			full: "100%",
		},

		maxHeight: {
			full: "100%",
			screen: "100vh",
			"2xs": "12rem",
			xs: "20rem",
		},

		padding: {
			px: "1px",
			"0": "0",
			"1": "0.25rem",
			"2": "0.5rem",
			"3": "0.75rem",
			"4": "1rem",
			"5": "1.25rem",
			"6": "1.5rem",
			"8": "2rem",
			"10": "2.5rem",
			"12": "3rem",
			"16": "4rem",
			"20": "5rem",
			"24": "6rem",
			"32": "8rem",
		},

		margin: {
			auto: "auto",
			px: "1px",
			"0": "0",
			"1": "0.25rem",
			"2": "0.5rem",
			"3": "0.75rem",
			"4": "1rem",
			"5": "1.25rem",
			"6": "1.5rem",
			"8": "2rem",
			"10": "2.5rem",
			"12": "3rem",
			"16": "4rem",
			"20": "5rem",
			"24": "6rem",
			"32": "8rem",
			"-px": "-1px",
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
		},

		boxShadow: {
			default: "0 2px 4px 0 rgba(0,0,0,0.10)",
			md: "0 4px 8px 0 rgba(0,0,0,0.12), 0 2px 4px 0 rgba(0,0,0,0.08)",
			lg: "0 15px 30px 0 rgba(0,0,0,0.11), 0 5px 15px 0 rgba(0,0,0,0.08)",
			inner: "inset 0 2px 4px 0 rgba(0,0,0,0.06)",
			outline: "0 0 0 3px rgba(52,144,220,0.5)",
			none: "none",
		},

		zIndex: {
			auto: "auto",
			"0": 0,
			"10": 10,
			"20": 20,
			"30": 30,
			"40": 40,
			"50": 50,
		},

		opacity: {
			"0": "0",
			"25": ".25",
			"37.5": ".375",
			"50": ".5",
			"75": ".75",
			"85": ".85", // added
			"100": "1",
		},

		fill: {
			current: "currentColor",
		},

		stroke: {
			current: "currentColor",
		},
	},

	variants: {
		appearance: ["responsive"],
		backgroundAttachment: ["responsive"],
		backgroundColor: ["responsive", "hover", "focus"],
		backgroundPosition: ["responsive"],
		backgroundRepeat: ["responsive"],
		backgroundSize: ["responsive"],
		borderCollapse: [],
		borderColor: ["responsive", "hover", "focus", "group-hover"],
		borderRadius: ["responsive"],
		borderStyle: ["responsive"],
		borderWidth: ["responsive"],
		cursor: ["responsive"],
		display: ["responsive", "group-hover"],
		flexDirection: ["responsive"],
		flexWrap: ["responsive"],
		alignItems: ["responsive"],
		alignSelf: ["responsive"],
		justifyContent: ["responsive"],
		alignContent: ["responsive"],
		flex: ["responsive"],
		flexGrow: ["responsive"],
		flexShrink: ["responsive"],
		float: ["responsive"],
		fontFamily: ["responsive"],
		fontWeight: ["responsive", "hover", "focus"],
		height: ["responsive"],
		lineHeight: ["responsive"],
		listStylePosition: ["responsive"],
		listStyleType: ["responsive"],
		margin: ["responsive"],
		maxHeight: ["responsive"],
		maxWidth: ["responsive"],
		minHeight: ["responsive"],
		minWidth: ["responsive"],
		negativeMargin: ["responsive"],
		opacity: ["responsive", "hover"],
		outline: ["focus"],
		overflow: ["responsive"],
		padding: ["responsive"],
		pointerEvents: ["responsive"],
		position: ["responsive"],
		resize: ["responsive"],
		boxShadow: ["responsive", "hover", "focus"],
		fill: [],
		stroke: [],
		tableLayout: ["responsive"],
		textAlign: ["responsive"],
		textColor: ["responsive", "hover", "focus"],
		fontSize: ["responsive"],
		fontStyle: ["responsive"],
		fontSmoothing: ["responsive"],
		textDecoration: ["responsive", "hover", "focus"],
		textTransform: ["responsive"],
		letterSpacing: ["responsive"],
		userSelect: ["responsive"],
		verticalAlign: ["responsive"],
		visibility: ["responsive"],
		whitespace: ["responsive"],
		width: ["responsive"],
		zIndex: ["responsive"],
	},

	corePlugins: {
		transitionProperty: false,
	},
};
