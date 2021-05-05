import tw from "twin.macro";

import { DropdownVariantType } from "./Dropdown";

export const defaultClasses = "mt-3 py-3 absolute z-10 bg-theme-background rounded-xl shadow-xl";

const getVariant = (variant: DropdownVariantType): any => {
	if (variant === "options" || variant === "votesFilter") {
		return tw`dark:bg-theme-secondary-800`;
	}

	return tw`border-2 border-theme-primary-100 dark:border-theme-secondary-800`;
};

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

export const getStyles = ({ position, variant }: any) => [getVariant(variant), getPosition(position)];
