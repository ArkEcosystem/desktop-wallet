import tw, { css } from "twin.macro";

const baseStyle = [tw`form-checkbox h-4 w-4 transition duration-150 ease-in-out`];

const getColor = (color: string): any => {
	const colorBase = `var(--theme-color-${color})`;

	switch (color) {
		case "primary":
			return css`
				color: ${colorBase};
			`;
		case "success":
			return css`
				color: ${colorBase};
			`;
		case "danger":
			return css`
				color: ${colorBase};
			`;
		case "warning":
			return css`
				color: ${colorBase};
			`;
	}
};

export const getStyles = ({ color }: { color?: string }) => {
	return [...baseStyle, ...getColor(color!)];
};
