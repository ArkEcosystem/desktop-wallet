import tw, { css } from "twin.macro";

const baseStyle = [
	tw`rounded-full`,
	css`
		@keyframes spin {
			to {
				transform: rotate(360deg);
			}
		}
		animation: spin 1.2s linear infinite;
		border: 5px solid var(--theme-color-neutral-200);
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

const getSize = (size: string): any => {
	switch (size) {
		case "small":
			return tw`w-5 h-5`;
		case "large":
			return tw`w-12 h-12`;
		default:
			return tw`w-8 h-8`;
	}
};

export const getStyles = ({ color, size }: { color?: string; size?: string }) => {
	return [...baseStyle, getSize(size!), ...getColor(color!)];
};
