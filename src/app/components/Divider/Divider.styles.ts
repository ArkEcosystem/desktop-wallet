import tw, { css } from "twin.macro";

const baseStyle = [tw`border-t border-solid`];

const getType = (type: string): any => {
	switch (type) {
		case "horizontal":
			return tw`flex clear-both w-full min-w-full my-6`;
		case "vertical":
			return tw`relative inline-block align-middle border-t-0 border-l border-solid mx-2`;
	}
};

const getSize = (type: string, size: string): any => {
	if (type === "vertical") {
		switch (size) {
			case "sm":
				return tw`h-2`;
			case "lg":
				return tw`h-8`;
			default:
				return tw`h-4`;
		}
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

export const getStyles = ({ size, type, dashed }: { size?: string; type?: string; dashed?: boolean }) => [
	getSize(type!, size!),
	...baseStyle,
	getType(type!),
	isDashed(dashed!),
];
