import tw from "twin.macro";

import { TableRowFunction } from "./TableRow";

const baseStyle = [tw`transition-colors duration-100`];

const getCursorStyles = (onClick?: TableRowFunction): any => (onClick ? tw`cursor-pointer` : "");

const getBorderStyles = (border?: boolean): any =>
	border ? tw`border-b last:border-b-0 border-dashed border-theme-neutral-300 dark:border-theme-neutral-800` : "";

export const getStyles = ({ border, onClick }: any) => [
	...baseStyle,
	getBorderStyles(border),
	getCursorStyles(onClick),
];
