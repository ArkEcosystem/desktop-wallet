import tw, { css } from "twin.macro";

import { TableRowFunction } from "./TableRow";

const baseStyle = tw`transition-colors duration-100`;

const getCursorStyles = (onClick?: TableRowFunction): any => (onClick ? tw`cursor-pointer` : "");

const getBorderStyles = (border?: boolean, dotted?: boolean): any => {
	if (!border) {
		return "";
	}

	return [
		tw`border-b last:border-b-0 border-theme-secondary-300 dark:border-theme-secondary-800`,
		dotted ? tw`border-dotted` : tw`border-dashed`,
	];
};

const getHoverStyles = (isSelected?: boolean): any =>
	css`
		&:hover td > div {
			${isSelected
				? tw`bg-theme-success-100 dark:bg-theme-success-900`
				: tw`bg-theme-secondary-100 dark:bg-black`}
		}
	`;

export const getStyles = ({ onClick, border, dotted, isSelected }: any) => {
	const styles = [baseStyle, getBorderStyles(border, dotted), getCursorStyles(onClick)];

	if (onClick) {
		styles.push(getHoverStyles(isSelected));
	}

	return styles;
};
