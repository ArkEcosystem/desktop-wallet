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

const isDashed = (dashed: boolean): any => {
	if (dashed) {
		return [
			tw`border-dashed`,
			css`
				background: none;
				border-width: 1px 0 0;
			`,
		];
	}

	return null;
};

export const getStyles = ({ type, dashed }: { type?: string; dashed?: boolean }) => {
	return [...baseStyle, getType(type!), isDashed(dashed!)];
};
