import tw from "twin.macro";

const baseStyles = () => tw`flex items-center`;

const getBorder = (border?: boolean, borderPosition?: "top" | "bottom" | "both") =>
	border
		? [
				tw`border-dashed border-theme-neutral-300 dark:border-theme-neutral-800`,
				borderPosition === "both"
					? tw`border-t border-b`
					: borderPosition === "top"
					? tw`border-t`
					: tw`border-b`,
		  ]
		: [];

const getPadding = (paddingPosition?: "top" | "bottom" | "both") => {
	if (!paddingPosition || paddingPosition === "both") {
		return tw`py-6`;
	}

	return paddingPosition === "top" ? tw`pt-6` : tw`pb-6`;
};

export const getStyles = ({
	border,
	borderPosition,
	paddingPosition,
}: {
	border?: boolean;
	borderPosition?: "top" | "bottom" | "both";
	paddingPosition?: "top" | "bottom" | "both";
}) => [baseStyles(), ...getBorder(border, borderPosition), getPadding(paddingPosition)];
