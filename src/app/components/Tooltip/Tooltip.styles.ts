export const getVariantClassNames = (variant: string) => {
	switch (variant) {
		case "small":
			return "text-xs font-medium";
		default:
			return "";
	}
};
