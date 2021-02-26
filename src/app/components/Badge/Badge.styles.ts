import tw, { css } from "twin.macro";
import { Position, Size } from "types";

const baseStyle = (size?: Size) => {
	const shadowSize = size === "sm" ? "3px" : "5px";
	return [
		css`
			& {
				box-shadow: 0 0 0 ${shadowSize} var(--theme-background-color);
			}
		`,
		tw`absolute transform`,
	];
};

const shape = "flex border-2 rounded-full justify-center items-center align-middle";
const colors = "bg-theme-background border-transparent";

export const defaultClasses = `${shape} ${colors}`;

const getPosition = (position?: Position): any => {
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

const getSize = (size?: Size) => {
	switch (size) {
		case "lg":
			return tw`w-6 h-6`;
		case "sm":
			return tw`w-2 h-2`;
		default:
			return tw`w-5 h-5`;
	}
};

export const getStyles = ({ position, size }: { position?: Position; size?: Size }) => [
	...baseStyle(size),
	getPosition(position),
	getSize(size),
];
