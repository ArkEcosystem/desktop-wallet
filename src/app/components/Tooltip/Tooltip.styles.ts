import { Size } from "types";

export const getStyles = (size?: Size) => {
	switch (size) {
		case "sm":
			return "text-xs font-medium";
		default:
			return "";
	}
};
