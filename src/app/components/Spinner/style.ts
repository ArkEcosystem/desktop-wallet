import tw, { css } from "twin.macro";

const baseStyle = [
	css`
		@keyframes spin {
			to {
				transform: rotate(360deg);
			}
		}
		animation: spin 1.2s linear infinite;
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

const getSize = (size: string): any => {
	switch (size) {
		case "small":
			return tw`w-5`;
		case "default":
			return tw`w-12`;
		case "large":
			return tw`w-24`;
	}
};

export const getStyles = ({ color, size }: { color?: string; size?: string }) => {
	return [...baseStyle, getSize(size!)];
};
