import tw, { css } from "twin.macro";

const baseStyle = tw`inline-block font-semibold`;

const getColors = (name: string): any => {
	const textColor =
		({ primary: 500, success: 600, danger: 400, warning: 700 } as Record<string, number>)[name] || 600;
	const bgColor = ({ primary: 100, success: 200, danger: 100, warning: 100 } as Record<string, number>)[name] || 200;

	const color = `var(--theme-color-${name}-${textColor})`;
	const bg = `var(--theme-color-${name}-${bgColor})`;

	return css`
		color: ${color};
		background-color: ${bg};
		border-radius: 3px;
	`;
};

const getSize = (size: string): any => {
	switch (size) {
		case "large":
			return tw`px-2 text-lg rounded`;
		default:
			return tw`px-2 text-base rounded-sm`;
	}
};

export const getStyles = ({ color, size }: { color?: string; size?: string }) => {
	return [getSize(size!), baseStyle, getColors(color!)];
};
