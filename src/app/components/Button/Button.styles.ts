import tw, { css } from "twin.macro";
import { Size } from "types";

// @TODO add focus-visible:shadow-outline
const baseStyle = [
	tw`focus:outline-none inline-flex items-center font-semibold text-center transition-all duration-100 ease-linear rounded justify-center`,
	css`
		line-height: 1.25;
		&:disabled {
			${tw`bg-theme-neutral-200 text-theme-neutral-light cursor-not-allowed`}
		}
	`,
];

const getColorsVariable = (name: string): any => ({
	base: `var(--theme-color-${name})`,
	contrast: `var(--theme-color-${name}-contrast)`,
	rgb: `var(--theme-color-${name}-rgb)`,
	dark: `var(--theme-color-${name}-dark)`,
	light: `var(--theme-color-${name}-light)`,
});

const getVariant = (name: string, colorName: string, color: ReturnType<typeof getColorsVariable>): any => {
	switch (name) {
		case "solid":
			return css`
				color: ${colorName === "primary" ? "var(--theme-white)" : color.contrast};
				background-color: ${color.base};
				&:not(:focus):hover:enabled {
					background-color: ${color.dark};
					box-shadow: 2px 3px 10px 2px rgba(${color.rgb}, 0.2);
				}
			`;
		case "plain":
			return css`
				color: ${color.base};
				background-color: ${color.contrast};
				&:not(:focus):hover:enabled {
					color: ${["danger", "primary"].includes(colorName) ? "var(--theme-white)" : color.base};
					background-color: ${colorName === "danger"
						? "var(--theme-color-danger-400)"
						: colorName === "primary"
						? color.dark
						: color.light};
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
		case "transparent":
			return css`
				background-color: transparent;
				border: 0px none;
			`;
	}
};

const getSize = (size?: Size): any => {
	switch (size) {
		case "sm":
			return tw`px-3 py-2 space-x-2 text-sm`;
		case "lg":
			return tw`px-6 py-4 space-x-4 text-lg`;
		case "icon":
			return tw`p-3`;
		default:
			return tw`px-5 py-3 space-x-3 text-base`;
	}
};

export const getStyles = ({ variant, color, size }: { variant?: string; color?: string; size?: Size }) => [
	getSize(size),
	...baseStyle,
	...getVariant(variant!, color!, getColorsVariable(color!)),
];
