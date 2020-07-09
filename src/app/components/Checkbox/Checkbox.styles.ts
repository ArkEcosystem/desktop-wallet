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

const getVariant = (name?: any) => {
	switch (name) {
		case "thick":
			return [tw`border-2`];
		default:
			return [];
	}
};

export const getStyles = ({ color, variant }: { color?: string; variant?: string }) => {
	return [...baseStyle, ...getColor(color!), ...getVariant(variant!)];
};
