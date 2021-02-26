import tw, { css } from "twin.macro";

import { TableRowFunction } from "./TableRow";

const baseStyle = tw`transition-colors duration-100`;

const getCursorStyles = (onClick?: TableRowFunction): any => (onClick ? tw`cursor-pointer` : "");

const getBorderStyles = (border?: boolean): any =>
	border ? tw`border-b last:border-b-0 border-dashed border-theme-secondary-300 dark:border-theme-secondary-800` : "";

const getHoverStyles = (isSelected?: boolean): any =>
	css`
		&:hover td > div {
			${isSelected
				? tw`bg-theme-success-100 dark:bg-theme-success-900`
				: tw`bg-theme-secondary-100 dark:bg-black`}
		}
	`;

export const getStyles = ({ onClick, border, isSelected }: any) => {
	const styles = [baseStyle, getBorderStyles(border), getCursorStyles(onClick)];

	if (onClick) {
		styles.push(getHoverStyles(isSelected));
	}

	return styles;
};
