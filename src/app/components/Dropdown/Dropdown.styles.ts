import tw from "twin.macro";

export const defaultClasses = "mt-3 py-3 absolute z-10 rounded-lg shadow-xl";

const getBackground = (options?: any): any =>
	options ? tw`bg-white dark:bg-theme-secondary-800` : tw`bg-theme-background`;

const getPosition = (position: string): any => {
	switch (position) {
		case "bottom":
			return tw`bottom-0`;
		case "bottom-left":
			return tw`bottom-0 left-0`;
		case "left":
			return tw`left-0`;
		case "top-left":
			return tw`top-0 left-0`;
		case "top":
			return tw`top-0`;
		case "top-right":
			return tw`top-0 right-0`;
		case "right":
		default:
			return tw`right-0`;
	}
};

export const getStyles = ({ position, options }: any) => [getBackground(options), getPosition(position)];
