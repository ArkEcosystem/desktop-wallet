export const getVariantClassNames = (variant: string) => {
	switch (variant) {
		case "sm":
			return "text-xs font-medium";
		default:
			return "";
	}
};
