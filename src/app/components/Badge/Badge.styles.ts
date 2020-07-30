import tw, { css } from "twin.macro";

const baseStyle = [
	css`
		& {
			box-shadow: 0 0 0 5px var(--theme-background-color);
		}
	`,
	tw`absolute transform`,
];

const shape = "flex border-2 rounded-full justify-center w-5 h-5 items-center align-middle";
const colors = "bg-theme-background border-transparent";

export const defaultClasses = `${shape} ${colors}`;

const getPosition = (position: string): any => {
	switch (position) {
		case "bottom":
			return tw`bottom-1 translate-y-full`;
		case "bottom-left":
			return tw`bottom-0 translate-y-1/2 left-0 -translate-x-1/2`;
		case "left":
			return tw`left-1 -translate-x-full`;
		case "top-left":
			return tw`top-0 -translate-y-1/2 left-0 -translate-x-1/2`;
		case "top":
			return tw`top-1 -translate-y-full`;
		case "top-right":
			return tw`top-0 -translate-y-1/2 right-0 translate-x-1/2`;
		case "right":
			return tw`right-1 translate-x-full`;
		default:
			// bottom-right
			return tw`bottom-0 translate-y-1/2 right-0 translate-x-1/2`;
	}
};

export const getStyles = ({ position }: any) => [...baseStyle, getPosition(position)];
