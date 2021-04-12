import tw, { css } from "twin.macro";
import { Color } from "types";

import { CheckboxVariantType } from "./Checkbox";

const baseStyle = [
	tw`w-4 h-4 transition duration-150 ease-in-out rounded focus:ring-offset-0 border-theme-secondary-300 dark:(bg-theme-secondary-800 border-2 border-theme-secondary-700)`,
];

const getColor = (color: Color) => {
	const baseColors: Record<string, string> = {
		info: "primary-600",
		success: "success-600",
		warning: "warning-600",
		danger: "danger-400",
		hint: "hint-500",
	};

	return css`
		color: var(--theme-color-${baseColors[color]});
	`;
};

const getVariant = (variant?: CheckboxVariantType) => {
	switch (variant) {
		case "thick":
			return [tw`border-2`];
		case "votesFilter":
			return [tw`w-5 h-5`];
		default:
			return [];
	}
};

export const getStyles = ({ color, variant }: { color?: Color; variant?: CheckboxVariantType }) => [
	...baseStyle,
	...getColor(color!),
	...getVariant(variant),
];
