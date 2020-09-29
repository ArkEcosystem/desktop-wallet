import tw from "twin.macro";

const baseStyles = () => tw`flex items-center`;

const getBorder = (border?: boolean, borderPosition?: "top" | "bottom") => border
		? [tw`border-dashed border-theme-neutral-300`, borderPosition === "top" ? tw`border-t` : tw`border-b`]
		: [];

const getPadding = (padding?: boolean) => padding && tw`py-6`;

export const getStyles = ({
	border,
	borderPosition,
	padding,
}: {
	border?: boolean;
	borderPosition?: "top" | "bottom";
	padding?: boolean;
}) => [baseStyles(), ...getBorder(border, borderPosition), getPadding(padding)];
