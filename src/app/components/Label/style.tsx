import tw, { css } from "twin.macro";

const baseStyle = tw`inline-block font-semibold`;

const getColors = (name: string): any => {
	return css`
		color: var(--theme-color- ${name}-700);
		background-color: var(--theme-color- ${name}-300);
	`;
};

const getSize = (size: string): any => {
	switch (size) {
		case "default":
			return tw`px-1 text-base rounded-sm`;
		case "large":
			return tw`px-2 text-lg rounded`;
	}
};

export const getStyles = ({ color, size }: { color?: string; size?: string }) => {
	return [getSize(size!), baseStyle, getColors(color!)];
};
