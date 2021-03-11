import tw from "twin.macro";

const baseStyles = () => tw`flex items-center`;

const getBorder = (border?: boolean, borderPosition?: "top" | "bottom" | "both") =>
	border
		? [
				tw`border-dashed border-theme-secondary-300 dark:border-theme-secondary-800`,
				borderPosition === "both"
					? tw`border-t border-b`
					: borderPosition === "top"
					? tw`border-t`
					: tw`border-b`,
		  ]
		: [];

const getPadding = (padding?: boolean, paddingPosition?: "top" | "bottom" | "both" | "none") =>
	padding
		? !paddingPosition || paddingPosition === "both"
			? tw`py-6`
			: paddingPosition === "top"
			? tw`pt-6`
			: paddingPosition === "none"
			? ``
			: tw`pb-6`
		: tw`py-0`;

export const getStyles = ({
	border,
	borderPosition,
	padding,
	paddingPosition,
}: {
	border?: boolean;
	borderPosition?: "top" | "bottom" | "both";
	padding?: boolean;
	paddingPosition?: "top" | "bottom" | "both" | "none";
}) => [baseStyles(), ...getBorder(border, borderPosition), getPadding(padding, paddingPosition)];
