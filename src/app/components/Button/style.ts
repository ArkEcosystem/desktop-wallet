import tw, { css } from "twin.macro";

const baseStyle = [
	tw`rounded focus:outline-none focus:shadow-outline font-semibold text-center transition-all ease-linear duration-100`,
	css`
		&:disabled {
			${tw`cursor-not-allowed bg-theme-neutral-light text-theme-neutral`}
		}
	`,
];

const getColorsVariable = (name: string): any => {
	return {
		base: `var(--theme-color-${name})`,
		contrast: `var(--theme-color-${name}-contrast)`,
		rgb: `var(--theme-color-${name}-rgb)`,
		dark: `var(--theme-color-${name}-dark)`,
		light: `var(--theme-color-${name}-light)`,
	};
};

const getVariant = (name: string, color: ReturnType<typeof getColorsVariable>): any => {
	switch (name) {
		case "solid":
			return css`
				color: ${color.contrast};
				background-color: ${color.base};
				&:not(:focus):hover:enabled {
					box-shadow: 2px 3px 10px 2px rgba(${color.rgb}, 0.2);
				}
			`;
		case "plain":
			return css`
				color: ${color.base};
				background-color: ${color.contrast};
				&:not(:focus):hover:enabled {
					background-color: ${color.light};
				}
			`;
		case "outline":
			return css`
				color: ${color.base};
				border: 2px solid ${color.contrast};
				&:not(:focus):hover:enabled {
					border-color: ${color.light};
				}
			`;
	}
};

const getSize = (size: string): any => {
	switch (size) {
		case "small":
			return tw`text-sm px-2 py-1`;
		case "default":
			return tw`text-base px-4 py-2`;
		case "large":
			return tw`text-lg px-5 py-3`;
	}
};

export const getStyles = ({ variant, color, size }: { variant?: string; color?: string; size?: string }) => {
	return [
		getSize(size!),
		...baseStyle,
		...getVariant(variant!, getColorsVariable(color!)),
	];
};

export default getStyles;
