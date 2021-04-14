import tw, { css } from "twin.macro";
import { Color } from "types";

import { urlEncodeRootColor } from "../../../utils/url-encode-root-color";

const baseStyle = [
	tw`w-5 h-5 bg-transparent`,
	tw`border-2 border-theme-secondary-300 rounded`,
	tw`transition duration-150 ease-in-out`,
	tw`focus:ring-offset-0`,
	tw`cursor-pointer`,
	tw`dark:(border-theme-secondary-600)`,
	tw`checked:hover:(
		border-theme-secondary-300
		dark:(border-theme-secondary-600)
	)`,
	tw`disabled:(
		bg-theme-secondary-200 border-theme-secondary-300 cursor-default
		dark:(bg-theme-secondary-800 border-theme-secondary-600)
	)!`,
	css`
		&:checked:disabled {
			background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='${urlEncodeRootColor(
				"--theme-color-secondary-300",
			)}' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");

			@media (prefers-color-scheme: dark) {
				background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='${urlEncodeRootColor(
					"--theme-color-secondary-600",
				)}' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
			}
		}
	`,
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
		&:hover {
			border-color: var(--theme-color-${baseColors[color]});
		}
	`;
};

const getVariant = (variant?: any) => {
	switch (variant) {
		default:
			return [];
	}
};

export const getStyles = ({ color, variant }: { color?: Color; variant?: string }) => [
	...baseStyle,
	...getColor(color!),
	...getVariant(variant!),
];
