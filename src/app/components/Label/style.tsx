import tw, { css } from "twin.macro";

const baseStyle = tw`inline-block font-semibold`;

const getColors = (name: string): any => {
	const color = `var(--theme-color-${name}-500)`;
	const bg = `var(--theme-color-${name}-200)`;

	return css`
		color: ${color};
		background-color: ${bg};
		border-radius: 3px;
	`;
};

const getSize = (size: string): any => {
	switch (size) {
		case "small":
		default:
			return tw`px-2 text-base rounded-sm`;
		case "large":
			return tw`px-2 text-lg rounded`;
	}
};

export const getStyles = ({ color, size }: { color?: string; size?: string }) => {
	return [getSize(size!), baseStyle, getColors(color!)];
};
