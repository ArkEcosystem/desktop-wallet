import { Size } from "types";

export const getVariantClassNames = (variant: Size) => {
	switch (variant) {
		case "sm":
			return "text-xs font-medium";
		default:
			return "";
	}
};
