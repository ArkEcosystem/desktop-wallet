import tw, { css } from "twin.macro";

const baseStyle = [tw`border-t border-solid border-theme-neutral-300`];

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
				tw`relative h-4 inline-block align-middle border-t-0 border-l border-solid border-theme-neutral-300`,
				css`
					top: -0.06em;
					margin: 0 8px;
				`,
			];
	}
};

export const getStyles = ({ type }: { type?: string }) => {
	return [getType(type!), ...baseStyle];
};
