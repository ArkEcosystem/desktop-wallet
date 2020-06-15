import tw, { css } from "twin.macro";

const baseStyle = [tw`w-4 h-4 transition duration-150 ease-in-out form-checkbox`];

const getColor = (color: string) => {
	const colorBase = `var(--theme-color-${color})`;

	if (!["primary", "success", "danger", "warning"].includes(color)) {
		throw new Error(`Failed to find a color for "${color}"`);
	}

	return css`
		color: ${colorBase};
	`;
};

export const getStyles = ({ color }: { color?: string }) => {
	return [...baseStyle, ...getColor(color!)];
};
