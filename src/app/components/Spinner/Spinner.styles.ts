import tw, { css } from "twin.macro";
import { Size } from "types";

const baseStyle = [
	tw`rounded-full`,
	css`
		@keyframes spin {
			to {
				transform: rotate(360deg);
			}
		}
		animation: spin 1.2s linear infinite;
		border: 5px solid var(--theme-color-secondary-200);
	`,
];

const getColor = (color: string): any => {
	const colorBase = `var(--theme-color-${color})`;

	if (!["primary", "success", "danger", "warning"].includes(color)) {
		throw new Error(`Failed to find a color for "${color}"`);
	}

	return css`
		border-left-color: ${colorBase};
	`;
};

const getSize = (size?: Size): any => {
	switch (size) {
		case "sm":
			return tw`w-5 h-5`;
		case "lg":
			return tw`w-12 h-12`;
		default:
			return tw`w-8 h-8`;
	}
};

export const getStyles = ({ color, size }: { color?: string; size?: Size }) => [
	...baseStyle,
	getSize(size),
	...getColor(color!),
];
