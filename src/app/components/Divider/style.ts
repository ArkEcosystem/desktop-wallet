import tw, { css } from "twin.macro";

const baseStyle = [
	css`
		border-top: 1px solid var(--theme-color-neutral-300);
	`,
];

const getType = (type: string): any => {
	switch (type) {
		case "horizontal":
			return [
				tw`flex clear-both w-full min-w-full`,
				css`
					margin: 24px 0;
				`,
			];
		case "vertical":
			return [
				tw`relative inline-block align-middle border-t-0`,
				css`
					top: -0.06em;
					height: 0.9rem;
					margin: 0 8px;
					border-left: 1px solid var(--theme-color-neutral-300);
				`,
			];
	}
};

export const getStyles = ({ type }: { type?: string }) => {
	return [getType(type!), ...baseStyle];
};
